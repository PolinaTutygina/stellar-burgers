/// <reference types="cypress" />

describe('Проверка работы страницы конструктора бургера', () => {
  const BUN_NAME = 'Краторная булка N-200i';
  const BUN_ID = '643d69a5c3f7b9001cfa093c';
  const MAIN_INGREDIENT_NAME = 'Биокотлета из марсианской Магнолии';
  const MAIN_INGREDIENT_ID = '643d69a5c3f7b9001cfa0941';
  const SAUCE_INGREDIENT_NAME = 'Соус фирменный Space Sauce';
  const SAUCE_INGREDIENT_ID = '643d69a5c3f7b9001cfa0943';

  const API_URL =
    Cypress.env('API_URL') || 'https://norma.nomoreparties.space/api';

  const BUN_SELECTOR = `[data-cy="ingredient-${BUN_NAME}"]`;
  const MAIN_INGREDIENT_SELECTOR = `[data-cy="ingredient-${MAIN_INGREDIENT_NAME}"]`;
  const SAUCE_INGREDIENT_SELECTOR = `[data-cy="ingredient-${SAUCE_INGREDIENT_NAME}"]`;
  const MAIN_INGREDIENT_LINK_SELECTOR = `[data-cy="ingredient-link-${MAIN_INGREDIENT_ID}"]`;
  const SAUCE_INGREDIENT_LINK_SELECTOR = `[data-cy="ingredient-link-${SAUCE_INGREDIENT_ID}"]`;

  const CONSTRUCTOR_SECTION = '[data-cy="burger-constructor"]';
  const MODAL_ROOT = '#modals';
  const ORDER_BUTTON = '[data-cy="order-button"]';
  const MODAL_TITLE = '[data-cy="modal-title"]';
  const MODAL_OVERLAY = '[data-cy="modal-overlay"]';

  beforeEach(() => {
    cy.fixture('ingredients.json').then((ingredientsData) => {
      cy.intercept('GET', `${API_URL}/ingredients`, {
        statusCode: 200,
        body: {
          success: true,
          data: ingredientsData
        }
      }).as('getIngredients');
    });

    cy.fixture('user.json').then((userData) => {
      cy.intercept('GET', `${API_URL}/auth/user`, {
        statusCode: 200,
        body: userData
      }).as('getUser');
    });

    cy.fixture('order.json').then((orderData) => {
      cy.intercept('POST', `${API_URL}/orders`, {
        statusCode: 200,
        body: orderData
      }).as('createOrder');
    });

    window.localStorage.setItem('refreshToken', 'mockTestRefreshToken');
    cy.setCookie('accessToken', 'mockTestAccessToken');

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('должен корректно загружать ингредиенты', () => {
    cy.get(BUN_SELECTOR).should('be.visible');
    cy.get(MAIN_INGREDIENT_SELECTOR).should('be.visible');
    cy.get(SAUCE_INGREDIENT_SELECTOR).should('be.visible');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('добавляет булку и начинку в конструктор', () => {
      cy.addIngredient(BUN_NAME);
      cy.get(CONSTRUCTOR_SECTION).as('constructorSection');

      cy.get('@constructorSection')
        .find('[data-cy="constructor-bun-top"]')
        .contains(`${BUN_NAME} (верх)`)
        .should('be.visible');
      cy.get('@constructorSection')
        .find('[data-cy="constructor-bun-bottom"]')
        .contains(`${BUN_NAME} (низ)`)
        .should('be.visible');

      cy.addIngredient(MAIN_INGREDIENT_NAME);

      cy.get('@constructorSection')
        .find('[data-cy="constructor-ingredients-list"]')
        .contains(MAIN_INGREDIENT_NAME)
        .should('be.visible');

      cy.checkIngredientCount(BUN_NAME, 2);
      cy.checkIngredientCount(MAIN_INGREDIENT_NAME, 1);
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('открывается при клике на ингредиент и корректно отображается', () => {
      cy.get(MAIN_INGREDIENT_LINK_SELECTOR).click();

      cy.get(MODAL_ROOT).as('modalRoot');
      cy.get('@modalRoot')
        .find(MODAL_TITLE)
        .contains('Детали ингредиента')
        .should('be.visible');
      cy.get('@modalRoot').contains(MAIN_INGREDIENT_NAME).should('be.visible');

      cy.closeModal();
    });

    it('закрывается по клику на оверлей', () => {
      cy.get(SAUCE_INGREDIENT_LINK_SELECTOR).click();

      cy.get(MODAL_ROOT).as('modalRoot');
      cy.get('@modalRoot')
        .find(MODAL_TITLE)
        .contains('Детали ингредиента')
        .should('be.visible');

      cy.get(MODAL_OVERLAY).click({ force: true });
      cy.get(MODAL_ROOT).should('be.empty');
    });
  });

  describe('Создание заказа', () => {
    it('позволяет создать заказ, отображает номер заказа и очищает конструктор', () => {
      cy.addIngredient(BUN_NAME);
      cy.addIngredient(MAIN_INGREDIENT_NAME);
      cy.addIngredient(SAUCE_INGREDIENT_NAME);

      cy.get(ORDER_BUTTON).click();

      cy.wait('@createOrder').its('response.statusCode').should('eq', 200);

      cy.get(MODAL_ROOT).as('modalRoot');
      cy.fixture('order.json').then((orderFixture) => {
        cy.get('@modalRoot')
          .find('[data-cy="order-number"]')
          .contains(orderFixture.order.number.toString())
          .should('be.visible');
      });
      cy.get('@modalRoot')
        .contains('идентификатор заказа')
        .should('be.visible');

      cy.closeModal();

      cy.get('[data-cy="constructor-placeholder-bun-top"]').should(
        'be.visible'
      );
      cy.get('[data-cy="constructor-placeholder-ingredients"]').should(
        'be.visible'
      );
      cy.get('[data-cy="constructor-total-price"]')
        .contains('0')
        .should('be.visible');

      cy.get(BUN_SELECTOR).find('div.counter').should('not.exist');
      cy.get(MAIN_INGREDIENT_SELECTOR).find('div.counter').should('not.exist');
      cy.get(SAUCE_INGREDIENT_SELECTOR).find('div.counter').should('not.exist');
    });

    it('перенаправляет на логин, если пользователь не авторизован', () => {
      cy.clearLocalStorage('refreshToken');
      cy.clearCookie('accessToken');

      cy.intercept('GET', `${API_URL}/auth/user`, {
        statusCode: 401,
        body: { success: false, message: 'You should be authorised' }
      }).as('getUnauthUser');

      cy.visit('/');
      cy.wait('@getIngredients');

      cy.addIngredient(BUN_NAME);
      cy.addIngredient(MAIN_INGREDIENT_NAME);

      cy.get(ORDER_BUTTON).click();

      cy.url().should('include', '/login');
      cy.contains('Вход').should('be.visible');
    });
  });
});
