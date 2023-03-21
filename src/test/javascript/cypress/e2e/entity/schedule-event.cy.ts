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

describe('ScheduleEvent e2e test', () => {
  const scheduleEventPageUrl = '/schedule-event';
  const scheduleEventPageUrlPattern = new RegExp('/schedule-event(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const scheduleEventSample = {};

  let scheduleEvent;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/schedule-events+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/schedule-events').as('postEntityRequest');
    cy.intercept('DELETE', '/api/schedule-events/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (scheduleEvent) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/schedule-events/${scheduleEvent.id}`,
      }).then(() => {
        scheduleEvent = undefined;
      });
    }
  });

  it('ScheduleEvents menu should load ScheduleEvents page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('schedule-event');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ScheduleEvent').should('exist');
    cy.url().should('match', scheduleEventPageUrlPattern);
  });

  describe('ScheduleEvent page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(scheduleEventPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ScheduleEvent page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/schedule-event/new$'));
        cy.getEntityCreateUpdateHeading('ScheduleEvent');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', scheduleEventPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/schedule-events',
          body: scheduleEventSample,
        }).then(({ body }) => {
          scheduleEvent = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/schedule-events+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [scheduleEvent],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(scheduleEventPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details ScheduleEvent page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('scheduleEvent');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', scheduleEventPageUrlPattern);
      });

      it('edit button click should load edit ScheduleEvent page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ScheduleEvent');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', scheduleEventPageUrlPattern);
      });

      it('edit button click should load edit ScheduleEvent page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ScheduleEvent');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', scheduleEventPageUrlPattern);
      });

      it('last delete button click should delete instance of ScheduleEvent', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('scheduleEvent').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', scheduleEventPageUrlPattern);

        scheduleEvent = undefined;
      });
    });
  });

  describe('new ScheduleEvent page', () => {
    beforeEach(() => {
      cy.visit(`${scheduleEventPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ScheduleEvent');
    });

    it('should create an instance of ScheduleEvent', () => {
      cy.get(`[data-cy="startTime"]`).type('2023-03-21T02:42').blur().should('have.value', '2023-03-21T02:42');

      cy.get(`[data-cy="endTime"]`).type('2023-03-21T16:02').blur().should('have.value', '2023-03-21T16:02');

      cy.get(`[data-cy="heading"]`).type('Movies Wooden').should('have.value', 'Movies Wooden');

      cy.get(`[data-cy="date"]`).type('2023-03-21T02:54').blur().should('have.value', '2023-03-21T02:54');

      cy.get(`[data-cy="details"]`).type('Springs copy').should('have.value', 'Springs copy');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        scheduleEvent = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', scheduleEventPageUrlPattern);
    });
  });
});
