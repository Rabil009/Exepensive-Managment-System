from fastapi.testclient import TestClient

from app.api.finance import FinanceService
from app.main import app


def test_finance_reads_report_database_failure_without_exposing_details(monkeypatch):
    def fail(*args, **kwargs):
        raise RuntimeError("private database detail")

    monkeypatch.setattr(FinanceService, "get_overview_metrics", fail)
    monkeypatch.setattr(FinanceService, "get_claims", fail)
    with TestClient(app) as client:
        expected = {
            "/api/finance/overview": "Finance overview is temporarily unavailable",
            "/api/finance/claims": "Finance claims are temporarily unavailable",
        }
        for path, detail in expected.items():
            response = client.get(path)
            assert response.status_code == 503
            assert response.json() == {"detail": detail}
            assert "private database detail" not in response.text
