package com.lodev09.truetabs

import android.content.Context
import android.content.res.ColorStateList
import android.graphics.Bitmap
import android.graphics.Color
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.graphics.drawable.GradientDrawable
import android.graphics.drawable.LayerDrawable
import android.graphics.drawable.RippleDrawable
import android.graphics.drawable.StateListDrawable
import android.util.Log
import android.util.LruCache
import android.view.ContextThemeWrapper
import android.view.Menu
import android.view.MenuItem
import android.view.View.MeasureSpec
import android.widget.FrameLayout
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.facebook.common.executors.UiThreadImmediateExecutorService
import com.facebook.common.references.CloseableReference
import com.facebook.datasource.DataSource
import com.facebook.drawee.backends.pipeline.Fresco
import com.facebook.imagepipeline.datasource.BaseBitmapDataSubscriber
import com.facebook.imagepipeline.image.CloseableImage
import com.facebook.imagepipeline.request.ImageRequest
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.views.imagehelper.ResourceDrawableIdHelper
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.navigation.NavigationBarView
import com.google.android.material.shape.RelativeCornerSize
import com.google.android.material.shape.ShapeAppearanceModel

class TrueTabsView(context: Context) : FrameLayout(context) {
  private val materialContext: Context = ContextThemeWrapper(context, com.google.android.material.R.style.Theme_MaterialComponents_DayNight)
  private val bottomNav: BottomNavigationView = BottomNavigationView(materialContext)
  private var selectedIndex: Int = 0
  private var activeColor: Int? = null
  private var inactiveColor: Int? = null

  companion object {
    private const val TAG = "TrueTabsView"
    private val imageCache = LruCache<String, Bitmap>(50)
  }

  init {
    bottomNav.layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
    bottomNav.labelVisibilityMode = NavigationBarView.LABEL_VISIBILITY_LABELED
    addView(bottomNav)

    // BottomNavigationView's default inset listener pads its bottom by
    // getSystemWindowInsetBottom(), which includes the IME — when the keyboard
    // opens, the item row gets pushed out of the bar. Apply only the system-bar
    // inset so the keyboard doesn't collapse the tabs.
    ViewCompat.setOnApplyWindowInsetsListener(bottomNav) { view, insets ->
      val bars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
      view.setPadding(bars.left, view.paddingTop, bars.right, bars.bottom)
      insets
    }

    bottomNav.setOnItemSelectedListener { item ->
      val index = item.itemId
      dispatchPress(index)
      if (index != selectedIndex) {
        selectedIndex = index
        dispatchSelect(index)
      }
      true
    }

    bottomNav.setOnItemReselectedListener { item ->
      dispatchPress(item.itemId)
    }
  }

  private fun dispatchPress(index: Int) {
    val reactContext = context as? ReactContext ?: return
    val eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, id) ?: return
    val surfaceId = UIManagerHelper.getSurfaceId(this)
    eventDispatcher.dispatchEvent(TabPressEvent(surfaceId, id, index))
  }

  private fun dispatchSelect(index: Int) {
    val reactContext = context as? ReactContext ?: return
    val eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, id) ?: return
    val surfaceId = UIManagerHelper.getSurfaceId(this)
    eventDispatcher.dispatchEvent(TabSelectEvent(surfaceId, id, index))
  }

  fun setItems(items: List<TabItemData>) {
    bottomNav.menu.clear()
    val count = minOf(items.size, bottomNav.maxItemCount)
    if (items.size > count) {
      Log.w(TAG, "BottomNavigationView supports up to ${bottomNav.maxItemCount} items, got ${items.size}")
    }
    for (i in 0 until count) {
      val item = items[i]
      val menuItem = bottomNav.menu.add(Menu.NONE, i, Menu.NONE, item.title)
      if (item.iconUri != null) {
        loadIcon(menuItem, item.iconUri)
      }
      if (item.badge != null) {
        bottomNav.getOrCreateBadge(i).number = item.badge.toIntOrNull() ?: 0
      } else {
        bottomNav.removeBadge(i)
      }
    }
    if (selectedIndex in 0 until count) {
      bottomNav.selectedItemId = selectedIndex
    }
  }

  private fun loadIcon(menuItem: MenuItem, iconUri: String) {
    val cached = imageCache.get(iconUri)
    if (cached != null) {
      menuItem.icon = BitmapDrawable(context.resources, cached)
      return
    }

    // Bare names are bundled drawable resources (release builds).
    if (!iconUri.contains("://") && !iconUri.startsWith("/")) {
      menuItem.icon = ResourceDrawableIdHelper.getResourceDrawable(context, iconUri)
      return
    }

    val uri = if (iconUri.startsWith("/")) "file://$iconUri" else iconUri
    val request = ImageRequest.fromUri(uri) ?: return
    val dataSource = Fresco.getImagePipeline().fetchDecodedImage(request, context)
    dataSource.subscribe(
      object : BaseBitmapDataSubscriber() {
        override fun onNewResultImpl(bitmap: Bitmap?) {
          if (bitmap == null) return
          // The pipeline reclaims its bitmap after this callback; keep a copy.
          val copy = bitmap.copy(bitmap.config ?: Bitmap.Config.ARGB_8888, false)
          imageCache.put(iconUri, copy)
          menuItem.icon = BitmapDrawable(context.resources, copy)
        }

        override fun onFailureImpl(dataSource: DataSource<CloseableReference<CloseableImage>>) {
          Log.w(TAG, "Failed to load icon: $iconUri", dataSource.failureCause)
        }
      },
      UiThreadImmediateExecutorService.getInstance()
    )
  }

  // RN swallows requestLayout from native children, so re-run the full
  // measure/layout pass ourselves whenever the menu or icons change.
  private val measureAndLayout = Runnable {
    measure(
      MeasureSpec.makeMeasureSpec(width, MeasureSpec.EXACTLY),
      MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY)
    )
    layout(left, top, right, bottom)
  }

  override fun requestLayout() {
    super.requestLayout()
    post(measureAndLayout)
  }

  fun setSelectedIndex(index: Int) {
    selectedIndex = index
    if (index in 0 until bottomNav.menu.size()) {
      bottomNav.selectedItemId = index
    }
  }

  fun setBarTintColor(color: Int?) {
    if (color != null) {
      bottomNav.backgroundTintList = ColorStateList.valueOf(color)
    }
  }

  fun setActiveTintColor(color: Int?) {
    activeColor = color
    applyItemColors()
  }

  fun setInactiveTintColor(color: Int?) {
    inactiveColor = color
    applyItemColors()
  }

  fun setActiveIndicatorColor(color: Int?) {
    if (color != null) {
      val density = resources.displayMetrics.density
      bottomNav.itemActiveIndicatorColor = ColorStateList.valueOf(color)
      bottomNav.itemActiveIndicatorWidth = (64 * density).toInt()
      bottomNav.itemActiveIndicatorHeight = (32 * density).toInt()
      bottomNav.itemActiveIndicatorMarginHorizontal = (4 * density).toInt()
      bottomNav.itemActiveIndicatorShapeAppearance =
        ShapeAppearanceModel.builder().setAllCornerSizes(RelativeCornerSize(0.5f)).build()
      bottomNav.isItemActiveIndicatorEnabled = true
    } else {
      bottomNav.isItemActiveIndicatorEnabled = false
    }
  }

  fun setActiveBackgroundColor(color: Int?) {
    if (color != null) {
      val density = resources.displayMetrics.density
      val insetH = (6 * density).toInt()
      val insetV = (3 * density).toInt()
      val radius = 8 * density

      // LayerDrawable with explicit zero padding — InsetDrawable would push its
      // insets into the view as padding and squeeze the icon/label.
      fun roundedRect(fill: Int): Drawable {
        val shape = GradientDrawable().apply {
          setColor(fill)
          cornerRadius = radius
        }
        return LayerDrawable(arrayOf<Drawable>(shape)).apply {
          setLayerInset(0, insetH, insetV, insetH, insetV)
          setPadding(0, 0, 0, 0)
        }
      }

      val checked = StateListDrawable().apply {
        addState(intArrayOf(android.R.attr.state_checked), roundedRect(color))
      }
      // Setting itemBackground replaces the default ripple; wrap to keep press feedback.
      val ripple = bottomNav.itemRippleColor
      bottomNav.itemBackground = if (ripple != null) {
        RippleDrawable(ripple, checked, roundedRect(Color.WHITE))
      } else {
        checked
      }
    } else {
      bottomNav.itemBackground = null
    }
  }

  private fun applyItemColors() {
    if (activeColor == null && inactiveColor == null) return
    val current = bottomNav.itemTextColor
    val active = activeColor
      ?: current?.getColorForState(intArrayOf(android.R.attr.state_checked), 0)
      ?: current?.defaultColor ?: 0
    val inactive = inactiveColor ?: current?.defaultColor ?: 0
    val colors = ColorStateList(
      arrayOf(intArrayOf(android.R.attr.state_checked), intArrayOf()),
      intArrayOf(active, inactive)
    )
    bottomNav.itemTextColor = colors
    bottomNav.itemIconTintList = colors
  }

  fun setTranslucent(translucent: Boolean) {
    // No direct equivalent on Android; could adjust alpha
  }
}

data class TabItemData(val title: String, val sfSymbol: String? = null, val iconUri: String? = null, val badge: String? = null)
