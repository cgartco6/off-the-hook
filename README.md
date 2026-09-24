# Off the Hook – Website + Owner Dashboard

High-converting landing page for **Off the Hook** with a built-in owner dashboard and local database.

## Files
- `index.html` – Main page + owner dashboard popup
- `styles.css` – All styling
- `script.js` – Product database + dashboard logic
- `logo.png` – Your logo

## Owner Dashboard (how to use)

1. Scroll to the very bottom of the website
2. Click the small **⚙️** icon in the footer
3. Enter the password: **offthehook2026**
4. You can now:
   - **Add** new products (name, price, description, photo)
   - **Edit** existing products
   - **Delete** products
   - **Export** all products as a JSON backup
   - **Import** a JSON file (from another device or backup)
   - **Reset** to the original default products

All changes are saved automatically in the browser’s local database (localStorage).

### Change the password
Open `script.js` and change this line near the top:
```js
const ADMIN_PASSWORD = 'offthehook2026';
