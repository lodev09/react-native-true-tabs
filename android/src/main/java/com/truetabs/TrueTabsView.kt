package com.truetabs

import android.content.Context
import android.graphics.BitmapFactory
import android.graphics.drawable.BitmapDrawable
import android.view.ContextThemeWrapper
import android.widget.FrameLayout
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.uimanager.UIManagerHelper
import com.google.android.material.tabs.TabLayout
import java.net.URL

class TrueTabsView(context: Context) : FrameLayout(context) {
  private val materialContext: Context = ContextThemeWrapper(context, com.google.android.material.R.style.Theme_MaterialComponents)
  private val tabLayout: TabLayout = TabLayout(materialContext)
  private var selectedIndex: Int = 0

  init {
    tabLayout.layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT)
    addView(tabLayout)

    tabLayout.addOnTabSelectedListener(
      object : TabLayout.OnTabSelectedListener {
        override fun onTabSelected(tab: TabLayout.Tab) {
          val index = tab.position
          if (index == selectedIndex) return
          selectedIndex = index

          val reactContext = context as? ReactContext ?: return
          val eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, id) ?: return
          val surfaceId = UIManagerHelper.getSurfaceId(this@TrueTabsView)
          eventDispatcher.dispatchEvent(TabSelectEvent(surfaceId, id, index))
        }

        override fun onTabUnselected(tab: TabLayout.Tab) {}

        override fun onTabReselected(tab: TabLayout.Tab) {}
      }
    )
  }

  fun setItems(items: List<TabItemData>) {
    tabLayout.removeAllTabs()
    for (item in items) {
      val tab = tabLayout.newTab().setText(item.title)
      if (item.iconUri != null) {
        try {
          val bitmap =
            if (item.iconUri.startsWith("file://") || item.iconUri.startsWith("/")) {
              val path = item.iconUri.removePrefix("file://")
              BitmapFactory.decodeFile(path)
            } else {
              val stream = URL(item.iconUri).openStream()
              BitmapFactory.decodeStream(stream)
            }
          if (bitmap != null) {
            tab.icon = BitmapDrawable(context.resources, bitmap)
          }
        } catch (_: Exception) {
        }
      }
      if (item.badge != null) {
        tab.orCreateBadge.number = item.badge.toIntOrNull() ?: 0
      }
      tabLayout.addTab(tab, false)
    }
    if (selectedIndex in 0 until tabLayout.tabCount) {
      tabLayout.getTabAt(selectedIndex)?.select()
    }
  }

  fun setSelectedIndex(index: Int) {
    selectedIndex = index
    if (index in 0 until tabLayout.tabCount) {
      tabLayout.getTabAt(index)?.select()
    }
  }

  fun setTintColor(color: Int?) {
    if (color != null) {
      tabLayout.backgroundTintList =
        android.content.res.ColorStateList
          .valueOf(color)
    }
  }

  fun setActiveTintColor(color: Int?) {
    if (color != null) {
      tabLayout.setSelectedTabIndicatorColor(color)
      tabLayout.setTabTextColors(tabLayout.tabTextColors?.defaultColor ?: 0, color)
    }
  }

  fun setTranslucent(translucent: Boolean) {
    // No direct equivalent on Android; could adjust alpha
  }
}

data class TabItemData(val title: String, val sfSymbol: String? = null, val iconUri: String? = null, val badge: String? = null)
