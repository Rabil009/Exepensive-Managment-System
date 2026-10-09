from fastapi.testclient import TestClient

from app.main import app
from app.services.approval_service import ApprovalService
from app.api import approvals
from app.services import approval_service


def test_manager_can_approve_and_reject_with_status_response(monkeypatch):
    monkeypatch.setattr(approval_service, "supabase", None)
    monkeypatch.setattr(approvals, "approval_service", ApprovalService())
    with TestClient(app) as client:
        approved = client.post("/api/manager/approvals/CLM-8821/approve", json={"remark": "Looks good"})
        assert approved.status_code == 200
        assert approved.json()["status"] == "Approved"
        assert approved.json()["managerRemark"] == "Looks good"

        rejected = client.post("/api/manager/approvals/CLM-8822/reject", json={"reason": "Missing receipt"})
        assert rejected.status_code == 200
        assert rejected.json()["status"] == "Rejected"
        assert rejected.json()["managerRemark"] == "Missing receipt"

        missing = client.post("/api/manager/approvals/no-such-claim/approve")
        assert missing.status_code == 404
        assert missing.json()["detail"] == "Claim no-such-claim not found"
