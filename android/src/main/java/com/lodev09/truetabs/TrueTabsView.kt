package com.lodev09.truetabs

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.drawable.BitmapDrawable
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.util.LruCache
import android.view.ContextThemeWrapper
import android.widget.FrameLayout
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.google.android.material.tabs.TabLayout
import java.net.URL
import java.util.concurrent.Executors

class TrueTabsView(context: Context) : FrameLayout(context) {
  private val materialContext: Context = ContextThemeWrapper(context, com.google.android.material.R.style.Theme_MaterialComponents)
  private val tabLayout: TabLayout = TabLayout(materialContext)
  private var selectedIndex: Int = 0

  companion object {
    private const val TAG = "TrueTabsView"
    private val imageCache = LruCache<String, Bitmap>(50)
    private val executor = Executors.newFixedThreadPool(2)
  }

  private val mainHandler = Handler(Looper.getMainLooper())

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
        val cached = imageCache.get(item.iconUri)
        if (cached != null) {
          tab.icon = BitmapDrawable(context.resources, cached)
        } else if (item.iconUri.startsWith("file://") || item.iconUri.startsWith("/")) {
          try {
            val path = item.iconUri.removePrefix("file://")
            val bitmap = BitmapFactory.decodeFile(path)
            if (bitmap != null) {
              imageCache.put(item.iconUri, bitmap)
              tab.icon = BitmapDrawable(context.resources, bitmap)
            }
          } catch (e: Exception) {
            Log.w(TAG, "Failed to load icon: ${item.iconUri}", e)
          }
        } else {
          val uri = item.iconUri
          executor.execute {
            try {
              val bitmap = URL(uri).openStream().use { stream ->
                BitmapFactory.decodeStream(stream)
              }
              if (bitmap != null) {
                imageCache.put(uri, bitmap)
                mainHandler.post {
                  tab.icon = BitmapDrawable(context.resources, bitmap)
                }
              }
            } catch (e: Exception) {
              Log.w(TAG, "Failed to load icon: $uri", e)
            }
          }
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
        android.content.res.ColorStateList.valueOf(color)
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
