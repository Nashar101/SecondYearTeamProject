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

describe('ExtensionID e2e test', () => {
  const extensionIDPageUrl = '/extension-id';
  const extensionIDPageUrlPattern = new RegExp('/extension-id(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const extensionIDSample = {};

  let extensionID;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/extension-ids+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/extension-ids').as('postEntityRequest');
    cy.intercept('DELETE', '/api/extension-ids/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (extensionID) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/extension-ids/${extensionID.id}`,
      }).then(() => {
        extensionID = undefined;
      });
    }
  });

  it('ExtensionIDS menu should load ExtensionIDS page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('extension-id');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ExtensionID').should('exist');
    cy.url().should('match', extensionIDPageUrlPattern);
  });

  describe('ExtensionID page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(extensionIDPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ExtensionID page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/extension-id/new$'));
        cy.getEntityCreateUpdateHeading('ExtensionID');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', extensionIDPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/extension-ids',
          body: extensionIDSample,
        }).then(({ body }) => {
          extensionID = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/extension-ids+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [extensionID],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(extensionIDPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details ExtensionID page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('extensionID');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', extensionIDPageUrlPattern);
      });

      it('edit button click should load edit ExtensionID page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ExtensionID');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', extensionIDPageUrlPattern);
      });

      it('edit button click should load edit ExtensionID page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ExtensionID');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', extensionIDPageUrlPattern);
      });

      it('last delete button click should delete instance of ExtensionID', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('extensionID').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', extensionIDPageUrlPattern);

        extensionID = undefined;
      });
    });
  });

  describe('new ExtensionID page', () => {
    beforeEach(() => {
      cy.visit(`${extensionIDPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ExtensionID');
    });

    it('should create an instance of ExtensionID', () => {
      cy.get(`[data-cy="extensionID"]`).type('white Maine Oklahoma').should('have.value', 'white Maine Oklahoma');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        extensionID = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', extensionIDPageUrlPattern);
    });
  });
});
