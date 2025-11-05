# TODO: Implement DELETE /api/cart

## Steps to Complete
- [x] Add `clearCart` async function to `src/controllers/cart.controller.js`
- [x] Update `src/routes/cart.routes.js` to import `clearCart` and add DELETE route
- [x] Create `tests/cart.clear.test.js` with Jest tests for the endpoint
- [x] Run tests to verify implementation

## Details
- clearCart: Find cart with populate, 404 if not found, clear items, save, recompute totals (all 0), return 200 with cart.toObject() and totals.
- Route: router.delete('/', authenticateToken, clearCart);
- Tests: auth required, 404 if no cart, clears cart successfully, discount query param.
