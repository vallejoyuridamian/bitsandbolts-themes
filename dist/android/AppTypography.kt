// bitsandbolts-themes — android/AppTypography.kt
// Static source file. Copied by build.js to dist/android/AppTypography.kt
// with REPLACE_ME substituted for the actual Android package name.
//
// Fonts are bundled as TTF in res/font/ — ZERO runtime network requests.
// Font files copied by dev.sh from bitsandbolts-themes/dist/android/fonts/:
//   plus_jakarta_sans_400.ttf, _500.ttf, _600.ttf, _700.ttf
//   inter_400.ttf, inter_500.ttf
//
// Mirrors the web theme:
//   --bb-font-family-display: 'Plus Jakarta Sans'
//   --bb-font-family-body:    'Inter'
package REPLACE_ME.ui.theme.generated

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import REPLACE_ME.R

// ─── Font families ────────────────────────────────────────────────────────────

val BbDisplayFontFamily = FontFamily(
    Font(R.font.plus_jakarta_sans_400, FontWeight.Normal),
    Font(R.font.plus_jakarta_sans_500, FontWeight.Medium),
    Font(R.font.plus_jakarta_sans_600, FontWeight.SemiBold),
    Font(R.font.plus_jakarta_sans_700, FontWeight.Bold),
)

val BbBodyFontFamily = FontFamily(
    Font(R.font.inter_400, FontWeight.Normal),
    Font(R.font.inter_500, FontWeight.Medium),
)

// ─── Typography scale ─────────────────────────────────────────────────────────
// Sizes and weights match Material 3 defaults; families override the typeface.
// Display/headline/title styles use Plus Jakarta Sans (same as web --bb-font-family-display).
// Body/label styles use Inter (same as web --bb-font-family-body).

val BbTypography = Typography(
    displayLarge  = TextStyle(fontFamily = BbDisplayFontFamily, fontWeight = FontWeight.Bold,     fontSize = 57.sp, lineHeight = 64.sp, letterSpacing = (-0.25).sp),
    displayMedium = TextStyle(fontFamily = BbDisplayFontFamily, fontWeight = FontWeight.Bold,     fontSize = 45.sp, lineHeight = 52.sp),
    displaySmall  = TextStyle(fontFamily = BbDisplayFontFamily, fontWeight = FontWeight.Bold,     fontSize = 36.sp, lineHeight = 44.sp),

    headlineLarge  = TextStyle(fontFamily = BbDisplayFontFamily, fontWeight = FontWeight.SemiBold, fontSize = 32.sp, lineHeight = 40.sp),
    headlineMedium = TextStyle(fontFamily = BbDisplayFontFamily, fontWeight = FontWeight.SemiBold, fontSize = 28.sp, lineHeight = 36.sp),
    headlineSmall  = TextStyle(fontFamily = BbDisplayFontFamily, fontWeight = FontWeight.SemiBold, fontSize = 24.sp, lineHeight = 32.sp),

    titleLarge  = TextStyle(fontFamily = BbDisplayFontFamily, fontWeight = FontWeight.Medium, fontSize = 22.sp, lineHeight = 28.sp),
    titleMedium = TextStyle(fontFamily = BbDisplayFontFamily, fontWeight = FontWeight.Medium, fontSize = 16.sp, lineHeight = 24.sp, letterSpacing = 0.15.sp),
    titleSmall  = TextStyle(fontFamily = BbDisplayFontFamily, fontWeight = FontWeight.Medium, fontSize = 14.sp, lineHeight = 20.sp, letterSpacing = 0.1.sp),

    bodyLarge   = TextStyle(fontFamily = BbBodyFontFamily, fontWeight = FontWeight.Normal, fontSize = 16.sp, lineHeight = 24.sp, letterSpacing = 0.5.sp),
    bodyMedium  = TextStyle(fontFamily = BbBodyFontFamily, fontWeight = FontWeight.Normal, fontSize = 14.sp, lineHeight = 20.sp, letterSpacing = 0.25.sp),
    bodySmall   = TextStyle(fontFamily = BbBodyFontFamily, fontWeight = FontWeight.Normal, fontSize = 12.sp, lineHeight = 16.sp, letterSpacing = 0.4.sp),

    labelLarge  = TextStyle(fontFamily = BbBodyFontFamily, fontWeight = FontWeight.Medium, fontSize = 14.sp, lineHeight = 20.sp, letterSpacing = 0.1.sp),
    labelMedium = TextStyle(fontFamily = BbBodyFontFamily, fontWeight = FontWeight.Medium, fontSize = 12.sp, lineHeight = 16.sp, letterSpacing = 0.5.sp),
    labelSmall  = TextStyle(fontFamily = BbBodyFontFamily, fontWeight = FontWeight.Medium, fontSize = 11.sp, lineHeight = 16.sp, letterSpacing = 0.5.sp),
)
