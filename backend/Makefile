.PHONY: run test coverage lint migrate

run:
	flask run --debug

test:
	pytest tests/ -v

coverage:
	pytest tests/ --cov=app --cov-report=term-missing --cov-fail-under=90

lint:
	black --check app/ tests/
	flake8 app/ tests/

migrate:
	flask db migrate
	flask db upgrade
