package com.truetabs

import android.content.Context
import android.widget.FrameLayout
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.uimanager.UIManagerHelper
import com.google.android.material.tabs.TabLayout

class TrueTabsView(context: Context) : FrameLayout(context) {
  private val tabLayout: TabLayout = TabLayout(context)
  private var selectedIndex: Int = 0

  init {
    tabLayout.layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT)
    addView(tabLayout)

    tabLayout.addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
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
    })
  }

  fun setItems(items: List<TabItemData>) {
    tabLayout.removeAllTabs()
    for (item in items) {
      val tab = tabLayout.newTab().setText(item.title)
      if (item.badge != null) {
        tab.orCreateBadge.number = item.badge.toIntOrNull() ?: 0
      }
      tabLayout.addTab(tab, false)
    }
    // Restore selection
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

  fun setTranslucent(translucent: Boolean) {
    // No direct equivalent on Android; could adjust alpha
  }
}

data class TabItemData(
  val title: String,
  val sfSymbol: String? = null,
  val badge: String? = null,
)
