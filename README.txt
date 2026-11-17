UgaChick MIS - Prototype (split version)

Open index.html in a browser. No server or build step needed.

File types and what each does
-----------------------------
index.html        HTML  - structure: login screen, sidebar, and the six pages
                          (Dashboard, Production, Inventory, Orders, Quality, Reports)
css/styles.css    CSS   - all styling (navy/blue theme, layout, tables, forms, badges)
js/data.js        JS    - demo users, localStorage load/save, sample data, inventory seeding
js/auth.js        JS    - login, logout, showing the app
js/navigation.js  JS    - sidebar page switching, mobile menu
js/render.js      JS    - draws dashboard, tables and reports from stored data
js/forms.js       JS    - form submit handlers, delete/confirm/dispatch actions, alerts
js/main.js        JS    - startup: seed data and auto-login

Other technologies used
-----------------------
Google Fonts (Inter) - loaded from the internet via <link> in index.html
Browser localStorage - stores production, orders, QC, inventory and the session
                       (no database or backend)

Demo logins: admin/admin123, manager/mgr123, officer/off123
Script order in index.html matters (data -> auth -> navigation -> render -> forms -> main).
