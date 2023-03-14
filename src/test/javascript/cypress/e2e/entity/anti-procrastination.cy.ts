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

describe('AntiProcrastination e2e test', () => {
  const antiProcrastinationPageUrl = '/anti-procrastination';
  const antiProcrastinationPageUrlPattern = new RegExp('/anti-procrastination(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const antiProcrastinationSample = { url: 'https://krystina.com', type: true, days: 99677, hours: 20035, minutes: 23022, seconds: 25851 };

  let antiProcrastination;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/anti-procrastinations+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/anti-procrastinations').as('postEntityRequest');
    cy.intercept('DELETE', '/api/anti-procrastinations/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (antiProcrastination) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/anti-procrastinations/${antiProcrastination.id}`,
      }).then(() => {
        antiProcrastination = undefined;
      });
    }
  });

  it('AntiProcrastinations menu should load AntiProcrastinations page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('anti-procrastination');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('AntiProcrastination').should('exist');
    cy.url().should('match', antiProcrastinationPageUrlPattern);
  });

  describe('AntiProcrastination page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(antiProcrastinationPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create AntiProcrastination page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/anti-procrastination/new$'));
        cy.getEntityCreateUpdateHeading('AntiProcrastination');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', antiProcrastinationPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/anti-procrastinations',
          body: antiProcrastinationSample,
        }).then(({ body }) => {
          antiProcrastination = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/anti-procrastinations+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [antiProcrastination],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(antiProcrastinationPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details AntiProcrastination page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('antiProcrastination');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', antiProcrastinationPageUrlPattern);
      });

      it('edit button click should load edit AntiProcrastination page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('AntiProcrastination');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', antiProcrastinationPageUrlPattern);
      });

      it('edit button click should load edit AntiProcrastination page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('AntiProcrastination');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', antiProcrastinationPageUrlPattern);
      });

      it('last delete button click should delete instance of AntiProcrastination', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('antiProcrastination').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', antiProcrastinationPageUrlPattern);

        antiProcrastination = undefined;
      });
    });
  });

  describe('new AntiProcrastination page', () => {
    beforeEach(() => {
      cy.visit(`${antiProcrastinationPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('AntiProcrastination');
    });

    it('should create an instance of AntiProcrastination', () => {
      cy.get(`[data-cy="url"]`).type('http://rosetta.name').should('have.value', 'http://rosetta.name');

      cy.get(`[data-cy="type"]`).should('not.be.checked');
      cy.get(`[data-cy="type"]`).click().should('be.checked');

      cy.get(`[data-cy="days"]`).type('83262').should('have.value', '83262');

      cy.get(`[data-cy="hours"]`).type('92284').should('have.value', '92284');

      cy.get(`[data-cy="minutes"]`).type('23103').should('have.value', '23103');

      cy.get(`[data-cy="seconds"]`).type('97644').should('have.value', '97644');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        antiProcrastination = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', antiProcrastinationPageUrlPattern);
    });
  });
});
