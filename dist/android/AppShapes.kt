// bitsandbolts-themes — android/AppShapes.kt
// Static source file. Copied by build.js to dist/android/AppShapes.kt
// with REPLACE_ME substituted for the actual Android package name.
//
// Shape contract: uses smaller corner radii to match the web component style
// (4-8dp), replacing Material 3's default pill-shaped buttons/fields.
package REPLACE_ME.ui.theme.generated

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Shapes
import androidx.compose.ui.unit.dp

/**
 * Component shapes matching bitsandbolts-themes button/card style.
 *
 * Material 3 defaults use very large (50%) corner radii for buttons (pill).
 * These values match the web theme (button: 4dp, card: 8dp, dialog: 12dp).
 */
val BbShapes = Shapes(
    extraSmall = RoundedCornerShape(4.dp),   // chips, text fields
    small      = RoundedCornerShape(6.dp),   // small buttons, snackbars
    medium     = RoundedCornerShape(8.dp),   // cards, outlined buttons, FAB
    large      = RoundedCornerShape(10.dp),  // bottom sheets, navigation drawers
    extraLarge = RoundedCornerShape(12.dp),  // large dialogs, full-screen modals
)
