package com.lodev09.truetabs

import android.content.Context
import android.content.res.ColorStateList
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.drawable.BitmapDrawable
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.util.LruCache
import android.view.ContextThemeWrapper
import android.view.Menu
import android.view.MenuItem
import android.view.View.MeasureSpec
import android.widget.FrameLayout
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.navigation.NavigationBarView
import java.net.URL
import java.util.concurrent.Executors

class TrueTabsView(context: Context) : FrameLayout(context) {
  private val materialContext: Context = ContextThemeWrapper(context, com.google.android.material.R.style.Theme_MaterialComponents_DayNight)
  private val bottomNav: BottomNavigationView = BottomNavigationView(materialContext)
  private var selectedIndex: Int = 0
  private var activeColor: Int? = null
  private var inactiveColor: Int? = null

  companion object {
    private const val TAG = "TrueTabsView"
    private val imageCache = LruCache<String, Bitmap>(50)
    private val executor = Executors.newFixedThreadPool(2)
  }

  private val mainHandler = Handler(Looper.getMainLooper())

  init {
    bottomNav.layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
    bottomNav.labelVisibilityMode = NavigationBarView.LABEL_VISIBILITY_LABELED
    addView(bottomNav)

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
    } else if (iconUri.startsWith("file://") || iconUri.startsWith("/")) {
      try {
        val path = iconUri.removePrefix("file://")
        val bitmap = BitmapFactory.decodeFile(path)
        if (bitmap != null) {
          imageCache.put(iconUri, bitmap)
          menuItem.icon = BitmapDrawable(context.resources, bitmap)
        }
      } catch (e: Exception) {
        Log.w(TAG, "Failed to load icon: $iconUri", e)
      }
    } else {
      executor.execute {
        try {
          val bitmap = URL(iconUri).openStream().use { stream ->
            BitmapFactory.decodeStream(stream)
          }
          if (bitmap != null) {
            imageCache.put(iconUri, bitmap)
            mainHandler.post {
              menuItem.icon = BitmapDrawable(context.resources, bitmap)
            }
          }
        } catch (e: Exception) {
          Log.w(TAG, "Failed to load icon: $iconUri", e)
        }
      }
    }
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
