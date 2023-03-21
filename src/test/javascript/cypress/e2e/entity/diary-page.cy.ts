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

describe('DiaryPage e2e test', () => {
  const diaryPagePageUrl = '/diary-page';
  const diaryPagePageUrlPattern = new RegExp('/diary-page(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const diaryPageSample = {
    pageDate: '2023-03-21T01:58:14.808Z',
    creationTime: '2023-03-21T00:29:30.300Z',
    lastEditTime: '2023-03-21T18:02:09.411Z',
  };

  let diaryPage;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/diary-pages+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/diary-pages').as('postEntityRequest');
    cy.intercept('DELETE', '/api/diary-pages/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (diaryPage) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/diary-pages/${diaryPage.id}`,
      }).then(() => {
        diaryPage = undefined;
      });
    }
  });

  it('DiaryPages menu should load DiaryPages page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('diary-page');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('DiaryPage').should('exist');
    cy.url().should('match', diaryPagePageUrlPattern);
  });

  describe('DiaryPage page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(diaryPagePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create DiaryPage page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/diary-page/new$'));
        cy.getEntityCreateUpdateHeading('DiaryPage');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', diaryPagePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/diary-pages',
          body: diaryPageSample,
        }).then(({ body }) => {
          diaryPage = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/diary-pages+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [diaryPage],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(diaryPagePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details DiaryPage page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('diaryPage');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', diaryPagePageUrlPattern);
      });

      it('edit button click should load edit DiaryPage page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('DiaryPage');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', diaryPagePageUrlPattern);
      });

      it('edit button click should load edit DiaryPage page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('DiaryPage');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', diaryPagePageUrlPattern);
      });

      it('last delete button click should delete instance of DiaryPage', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('diaryPage').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', diaryPagePageUrlPattern);

        diaryPage = undefined;
      });
    });
  });

  describe('new DiaryPage page', () => {
    beforeEach(() => {
      cy.visit(`${diaryPagePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('DiaryPage');
    });

    it('should create an instance of DiaryPage', () => {
      cy.get(`[data-cy="pageDate"]`).type('2023-03-21T07:57').blur().should('have.value', '2023-03-21T07:57');

      cy.get(`[data-cy="pageDescription"]`).type('Bike hybrid').should('have.value', 'Bike hybrid');

      cy.get(`[data-cy="creationTime"]`).type('2023-03-21T06:00').blur().should('have.value', '2023-03-21T06:00');

      cy.get(`[data-cy="lastEditTime"]`).type('2023-03-21T11:25').blur().should('have.value', '2023-03-21T11:25');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        diaryPage = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', diaryPagePageUrlPattern);
    });
  });
});
