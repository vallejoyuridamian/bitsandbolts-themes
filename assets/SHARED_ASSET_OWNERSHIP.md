# Shared Asset Ownership

The generated web distribution contains one global asset set, not one copy per
theme.

Shared theme-distributed assets:

- Android, Windows, and Linux platform marks;
- official Google Play and App Store badge artwork; and
- reusable Bits & Bolts brand assets.

Theme recipes own presentation around these assets, including size, spacing,
border, surface, focus, and responsive behavior. They do not recolor or rewrite
official store-badge content.

Product/site icons, customer logos, screenshots, illustrations, and uploaded
media are site assets. They belong in the private managed-site asset model and,
once hosting exists, in private R2 objects with canonical Postgres metadata.
They must not be added to a theme family.
