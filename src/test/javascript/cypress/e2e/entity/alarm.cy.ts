import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Alarm e2e test', () => {
  const alarmPageUrl = '/alarm';
  const alarmPageUrlPattern = new RegExp('/alarm(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const alarmSample = {};

  let alarm;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/alarms+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/alarms').as('postEntityRequest');
    cy.intercept('DELETE', '/api/alarms/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (alarm) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/alarms/${alarm.id}`,
      }).then(() => {
        alarm = undefined;
      });
    }
  });

  it('Alarms menu should load Alarms page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('alarm');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Alarm').should('exist');
    cy.url().should('match', alarmPageUrlPattern);
  });

  describe('Alarm page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(alarmPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Alarm page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/alarm/new$'));
        cy.getEntityCreateUpdateHeading('Alarm');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', alarmPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/alarms',
          body: alarmSample,
        }).then(({ body }) => {
          alarm = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/alarms+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [alarm],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(alarmPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Alarm page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('alarm');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', alarmPageUrlPattern);
      });

      it('edit button click should load edit Alarm page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Alarm');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', alarmPageUrlPattern);
      });

      it('edit button click should load edit Alarm page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Alarm');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', alarmPageUrlPattern);
      });

      it('last delete button click should delete instance of Alarm', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('alarm').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', alarmPageUrlPattern);

        alarm = undefined;
      });
    });
  });

  describe('new Alarm page', () => {
    beforeEach(() => {
      cy.visit(`${alarmPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Alarm');
    });

    it('should create an instance of Alarm', () => {
      cy.get(`[data-cy="alarmName"]`).type('Optimization indigo Switchable').should('have.value', 'Optimization indigo Switchable');

      cy.get(`[data-cy="type"]`).type('Planner Bolivia Grenada').should('have.value', 'Planner Bolivia Grenada');

      cy.get(`[data-cy="hours"]`).type('2633').should('have.value', '2633');

      cy.get(`[data-cy="minutes"]`).type('49518').should('have.value', '49518');

      cy.get(`[data-cy="seconds"]`).type('23419').should('have.value', '23419');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        alarm = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', alarmPageUrlPattern);
    });
  });
});
