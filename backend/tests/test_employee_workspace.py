from fastapi.testclient import TestClient

from app.api.employee_workspace import workspace
from app.main import app


class FakeGateway:
    def __init__(self):
        self.patches = []

    def employee(self):
        return {"id": "employee-1", "role": "EMPLOYEE"}

    def expenses(self, owner):
        assert owner == "employee-1"
        return [
            {"id": "claim-1", "date": "2026-10-08", "merchant": "Hotel", "category": "Accommodation", "amount": 8768.0, "status": "Pending", "raw_status": "SUBMITTED", "source": "claim", "description": "Travel", "receipt": None, "currency": "INR", "report": "Trip", "paymentMethod": "Personal (Out-of-Pocket)"},
            {"id": "draft-1", "date": "", "merchant": "Draft", "category": "Other", "amount": 2.0, "status": "Draft", "raw_status": "DRAFT", "source": "draft", "description": "", "receipt": None, "currency": "INR", "report": "Trip", "paymentMethod": ""},
        ]

    def cards(self, owner):
        assert owner == "employee-1"
        return [{"id": "d66933cd-b2e4-41d1-82e4-b565a8861614", "employee_id": owner, "display_name": "Card", "monthly_limit": "10000.00", "active": True}]

    def card_transactions(self, owner):
        assert owner == "employee-1"
        return [{"transaction_date": "2026-10-07", "amount": "100.00", "status": "SETTLED", "card_id": "d66933cd-b2e4-41d1-82e4-b565a8861614", "category": "TRAVEL"}]

    def card_requests(self, owner):
        return []

    def category_limits(self, owner):
        return [{"category": "TRAVEL", "monthly_limit": "500.00"}]

    def request(self, method, path, **kwargs):
        self.patches.append((method, path, kwargs))
        class Response:
            def json(self):
                if path.endswith("employee_cards"):
                    return [{"id": "d66933cd-b2e4-41d1-82e4-b565a8861614", "frozen": True}]
                if path.endswith("employee_card_requests"):
                    return [{"id": "request-1", "status": "PENDING"}]
                return 2
        return Response()


def client_with_gateway(gateway):
    app.dependency_overrides[workspace] = lambda: gateway
    return TestClient(app)


def test_employee_overview_analytics_and_reports_are_owner_scoped():
    gateway = FakeGateway()
    with client_with_gateway(gateway) as client:
        overview = client.get("/api/employee/overview").json()
        assert overview["summary"]["pending_approval"] == "8768.0"
        assert len(overview["expenses"]) == 2
        analytics = client.get("/api/employee/analytics?month=2026-10").json()
        assert analytics["totals"]["total_spend"] == "8768.0"
        assert analytics["totals"]["corporate_card_spend"] == "100.00"
        assert analytics["receipt_compliance"] == {"attached": 0, "total": 1}
        reports = client.get("/api/employee/reports").json()
        assert reports["reports"][0]["count"] == 2
        assert reports["reports"][0]["can_withdraw"] is False
        cards = client.get("/api/employee/cards").json()
        assert cards["usage"]["categories"][0]["remaining"] == "400.00"
    app.dependency_overrides.clear()


def test_card_controls_only_patch_allowed_fields_and_owner():
    gateway = FakeGateway()
    with client_with_gateway(gateway) as client:
        response = client.patch("/api/employee/cards/d66933cd-b2e4-41d1-82e4-b565a8861614", json={"frozen": True})
        assert response.status_code == 200
        method, path, kwargs = gateway.patches[-1]
        assert method == "PATCH"
        assert kwargs["params"]["employee_id"] == "eq.employee-1"
        assert kwargs["json"] == {"frozen": True}
        invalid = client.patch("/api/employee/cards/d66933cd-b2e4-41d1-82e4-b565a8861614", json={"monthly_limit": 999999})
        assert invalid.status_code == 422
    app.dependency_overrides.clear()


def test_limit_request_requires_owned_card_and_higher_amount():
    gateway = FakeGateway()
    with client_with_gateway(gateway) as client:
        payload = {"request_type": "LIMIT_INCREASE", "card_id": "d66933cd-b2e4-41d1-82e4-b565a8861614", "requested_limit": "9000"}
        assert client.post("/api/employee/cards/requests", json=payload).status_code == 422
        payload["requested_limit"] = "12000"
        response = client.post("/api/employee/cards/requests", json=payload)
        assert response.status_code == 201
        assert response.json()["status"] == "PENDING"
    app.dependency_overrides.clear()


def test_report_action_requires_employee_and_uses_rpc():
    assert TestClient(app).post("/api/employee/reports/action", json={"name": "Trip", "action": "withdraw"}).status_code == 401
    gateway = FakeGateway()
    with client_with_gateway(gateway) as client:
        response = client.post("/api/employee/reports/action", json={"name": "Trip", "action": "withdraw"})
        assert response.status_code == 200
        assert response.json() == {"changed": 2}
        assert gateway.patches[-1][2]["json"] == {"p_report_name": "Trip", "p_action": "withdraw"}
    app.dependency_overrides.clear()
