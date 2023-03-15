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

describe('TodolistItem e2e test', () => {
  const todolistItemPageUrl = '/todolist-item';
  const todolistItemPageUrlPattern = new RegExp('/todolist-item(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const todolistItemSample = {
    heading: 'virtual tertiary',
    description: 'e-enable',
    creationTime: '2023-03-06T13:46:19.890Z',
    lastEditTime: '2023-03-06T14:52:53.394Z',
    completed: false,
  };

  let todolistItem;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/todolist-items+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/todolist-items').as('postEntityRequest');
    cy.intercept('DELETE', '/api/todolist-items/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (todolistItem) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/todolist-items/${todolistItem.id}`,
      }).then(() => {
        todolistItem = undefined;
      });
    }
  });

  it('TodolistItems menu should load TodolistItems page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('todolist-item');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('TodolistItem').should('exist');
    cy.url().should('match', todolistItemPageUrlPattern);
  });

  describe('TodolistItem page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(todolistItemPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create TodolistItem page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/todolist-item/new$'));
        cy.getEntityCreateUpdateHeading('TodolistItem');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', todolistItemPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/todolist-items',
          body: todolistItemSample,
        }).then(({ body }) => {
          todolistItem = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/todolist-items+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [todolistItem],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(todolistItemPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details TodolistItem page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('todolistItem');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', todolistItemPageUrlPattern);
      });

      it('edit button click should load edit TodolistItem page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TodolistItem');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', todolistItemPageUrlPattern);
      });

      it('edit button click should load edit TodolistItem page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TodolistItem');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', todolistItemPageUrlPattern);
      });

      it('last delete button click should delete instance of TodolistItem', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('todolistItem').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', todolistItemPageUrlPattern);

        todolistItem = undefined;
      });
    });
  });

  describe('new TodolistItem page', () => {
    beforeEach(() => {
      cy.visit(`${todolistItemPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('TodolistItem');
    });

    it('should create an instance of TodolistItem', () => {
      cy.get(`[data-cy="heading"]`).type('Kentucky Rubber system').should('have.value', 'Kentucky Rubber system');

      cy.get(`[data-cy="description"]`).type('transmitter').should('have.value', 'transmitter');

      cy.get(`[data-cy="creationTime"]`).type('2023-03-05T22:36').blur().should('have.value', '2023-03-05T22:36');

      cy.get(`[data-cy="lastEditTime"]`).type('2023-03-06T20:23').blur().should('have.value', '2023-03-06T20:23');

      cy.get(`[data-cy="completed"]`).should('not.be.checked');
      cy.get(`[data-cy="completed"]`).click().should('be.checked');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        todolistItem = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', todolistItemPageUrlPattern);
    });
  });
});
