// bitsandbolts-themes — android/AppComponents.kt
// Static source file. Copied by build.js to dist/android/AppComponents.kt
// REPLACE_ME is substituted with the real Android package name by dev.sh.
//
// Components:
//   BbGoogleSignInButton — Google-branded sign-in button (matches google-signin.css)
//   BbSegmentedControl   — Tab-style selector (matches segmented-control.css)
package REPLACE_ME.ui.theme.generated

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.layout.RowScope
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonColors
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.LocalTextStyle
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import REPLACE_ME.R

// ─── Google Sign-In Button ────────────────────────────────────────────────────

/**
 * Google Sign-In button matching .bb-google-btn in google-signin.css.
 *
 * Google-blue (#4285F4) background, 4dp corners, white text.
 * The G icon sits on a white 24×24dp chip (3dp radius) so the multicolor
 * icon is clearly visible against the blue background.
 *
 * Do NOT use the app's primary color — Google branding requires this exact
 * blue (#4285F4) or the official white variant.
 */
@Composable
fun BbGoogleSignInButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
) {
    Button(
        onClick = onClick,
        modifier = modifier.height(48.dp),
        enabled = enabled,
        shape = RoundedCornerShape(4.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = Color(0xFF4285F4),
            contentColor = Color.White,
            disabledContainerColor = Color(0xFF4285F4).copy(alpha = 0.38f),
            disabledContentColor = Color.White.copy(alpha = 0.38f),
        ),
        elevation = ButtonDefaults.buttonElevation(
            defaultElevation = 1.dp,
            pressedElevation = 3.dp,
        ),
        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 0.dp),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            // White chip — makes multicolor G icon visible on the blue background
            Box(
                modifier = Modifier
                    .size(24.dp)
                    .background(Color.White, shape = RoundedCornerShape(3.dp)),
                contentAlignment = Alignment.Center,
            ) {
                Icon(
                    painter = painterResource(R.drawable.ic_google),
                    contentDescription = null,
                    modifier = Modifier.size(18.dp),
                    tint = Color.Unspecified,
                )
            }
            Spacer(Modifier.width(10.dp))
            Text(
                text = "Sign in with Google",
                style = MaterialTheme.typography.labelLarge,
            )
        }
    }
}

// ─── Segmented Control ────────────────────────────────────────────────────────

/**
 * Segmented control matching .bb-segmented-control in segmented-control.css.
 *
 * Visual contract (same as desktop):
 *   - Container: surfaceVariant background, 8dp radius, 2dp padding
 *   - Inactive item: transparent, onSurfaceVariant color
 *   - Active item: surface background, onSurface color, semibold, 1dp shadow
 *   - No checkmark icons — clean, minimal look
 *
 * @param options       Display labels for each segment.
 * @param selectedIndex Zero-based index of the currently selected segment.
 * @param onSelect      Called with the new index when a segment is tapped.
 */
@Composable
fun BbSegmentedControl(
    options: List<String>,
    selectedIndex: Int,
    onSelect: (Int) -> Unit,
    modifier: Modifier = Modifier,
) {
    Surface(
        color = MaterialTheme.colorScheme.surfaceVariant,
        shape = RoundedCornerShape(8.dp),
        modifier = modifier,
    ) {
        Row(
            modifier = Modifier.padding(2.dp),
            horizontalArrangement = Arrangement.spacedBy(2.dp),
        ) {
            options.forEachIndexed { index, label ->
                val isSelected = index == selectedIndex
                Surface(
                    color = if (isSelected) MaterialTheme.colorScheme.surface else Color.Transparent,
                    shape = RoundedCornerShape(6.dp),
                    shadowElevation = if (isSelected) 1.dp else 0.dp,
                    onClick = { onSelect(index) },
                    modifier = Modifier.heightIn(max = 28.dp),
                ) {
                    Text(
                        text = label,
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal,
                        color = if (isSelected) MaterialTheme.colorScheme.onSurface
                                else MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 2.dp),
                    )
                }
            }
        }
    }
}

// ─── Bb Buttons ───────────────────────────────────────────────────────────────

/**
 * Rectangular filled button matching desktop btn-action / btn-save style.
 * Uses extraSmall shape (4dp corners) so buttons look sharp, not pill-shaped.
 */
@Composable
fun BbButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    colors: ButtonColors = ButtonDefaults.buttonColors(),
    content: @Composable RowScope.() -> Unit,
) {
    Button(
        onClick = onClick,
        modifier = modifier.heightIn(max = 32.dp),
        enabled = enabled,
        shape = MaterialTheme.shapes.extraSmall,
        colors = colors,
        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
    ) {
        CompositionLocalProvider(LocalTextStyle provides MaterialTheme.typography.bodySmall) {
            content()
        }
    }
}

/**
 * Rectangular outlined button matching desktop btn-edit / btn-signout style.
 * Uses extraSmall shape (4dp corners) so buttons look sharp, not pill-shaped.
 */
@Composable
fun BbOutlinedButton(    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    colors: ButtonColors = ButtonDefaults.outlinedButtonColors(),
    content: @Composable RowScope.() -> Unit,
) {
    OutlinedButton(
        onClick = onClick,
        modifier = modifier.heightIn(max = 32.dp),
        enabled = enabled,
        shape = MaterialTheme.shapes.extraSmall,
        colors = colors,
        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
    ) {
        CompositionLocalProvider(LocalTextStyle provides MaterialTheme.typography.bodySmall) {
            content()
        }
    }
}

/**
 * Dialog action button matching desktop dialog.css.
 * Text-only, primary-colored, bold, and slightly larger than standard small button text.
 */
@Composable
fun BbDialogTextButton(
    label: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
) {
    TextButton(
        onClick = onClick,
        modifier = modifier,
        enabled = enabled,
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodyLarge,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary,
        )
    }
}

// ─── Content Card ─────────────────────────────────────────────────────────────

/**
 * Standard bordered card used throughout the app for content sections.
 *
 * Visual contract (matches app-wide card style):
 *   - Surface color: colorScheme.surface
 *   - Border: 1dp outlineVariant
 *   - Elevation: 1dp tonal
 *   - Default shape: MaterialTheme.shapes.medium (8dp per BbShapes)
 *
 * Pass [shape] to override — e.g. MaterialTheme.shapes.large (10dp) for list rows.
 * Pass [onClick] to make the card clickable (adds ripple).
 */
@Composable
fun BbContentCard(
    modifier: Modifier = Modifier,
    shape: Shape? = null,
    onClick: (() -> Unit)? = null,
    content: @Composable () -> Unit,
) {
    val resolvedShape = shape ?: MaterialTheme.shapes.medium
    if (onClick != null) {
        Surface(
            onClick = onClick,
            modifier = modifier,
            shape = resolvedShape,
            color = MaterialTheme.colorScheme.surface,
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
            tonalElevation = 1.dp,
            content = content,
        )
    } else {
        Surface(
            modifier = modifier,
            shape = resolvedShape,
            color = MaterialTheme.colorScheme.surface,
            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
            tonalElevation = 1.dp,
            content = content,
        )
    }
}
