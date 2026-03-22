#import "TrueTabsView.h"

#import <React/RCTConversions.h>

#import <react/renderer/components/TrueTabsViewSpec/ComponentDescriptors.h>
#import <react/renderer/components/TrueTabsViewSpec/EventEmitters.h>
#import <react/renderer/components/TrueTabsViewSpec/Props.h>
#import <react/renderer/components/TrueTabsViewSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

static NSCache<NSString *, UIImage *> *_imageCache;

@interface TrueTabsView () <UITabBarDelegate, RCTTrueTabsViewViewProtocol>
@end

@implementation TrueTabsView {
  UITabBar *_tabBar;
  NSInteger _selectedIndex;
  BOOL _needsTabItemsUpdate;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<TrueTabsViewComponentDescriptor>();
}

+ (void)initialize {
  if (self == [TrueTabsView class]) {
    _imageCache = [NSCache new];
    _imageCache.countLimit = 50;
  }
}

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps =
        std::make_shared<const TrueTabsViewProps>();
    _props = defaultProps;
    _selectedIndex = 0;

    _tabBar = [[UITabBar alloc] initWithFrame:self.bounds];
    _tabBar.delegate = self;
    _tabBar.autoresizingMask =
        UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;

    self.contentView = _tabBar;
  }
  return self;
}

- (void)updateProps:(Props::Shared const &)props
           oldProps:(Props::Shared const &)oldProps {
  const auto &oldViewProps =
      *std::static_pointer_cast<TrueTabsViewProps const>(_props);
  const auto &newViewProps =
      *std::static_pointer_cast<TrueTabsViewProps const>(props);

  if (oldViewProps.items.size() != newViewProps.items.size()) {
    _needsTabItemsUpdate = YES;
  } else {
    for (size_t i = 0; i < newViewProps.items.size(); i++) {
      const auto &oldItem = oldViewProps.items[i];
      const auto &newItem = newViewProps.items[i];
      if (oldItem.title != newItem.title ||
          oldItem.sfSymbol != newItem.sfSymbol ||
          oldItem.iconUri != newItem.iconUri ||
          oldItem.badge != newItem.badge) {
        _needsTabItemsUpdate = YES;
        break;
      }
    }
  }

  if (oldViewProps.selectedIndex != newViewProps.selectedIndex) {
    _selectedIndex = newViewProps.selectedIndex;
  }

  if (oldViewProps.translucent != newViewProps.translucent) {
    _tabBar.translucent = newViewProps.translucent;
  }

  if (oldViewProps.tintColor != newViewProps.tintColor) {
    _tabBar.barTintColor = newViewProps.tintColor
        ? RCTUIColorFromSharedColor(*newViewProps.tintColor)
        : nil;
  }

  if (oldViewProps.activeTintColor != newViewProps.activeTintColor) {
    _tabBar.tintColor = newViewProps.activeTintColor
        ? RCTUIColorFromSharedColor(*newViewProps.activeTintColor)
        : nil;
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask {
  [super finalizeUpdates:updateMask];

  NSLog(@"[TrueTabsView] finalizeUpdates mask: %lu, needsRebuild: %d", (unsigned long)updateMask, _needsTabItemsUpdate);

  if (!(updateMask & RNComponentViewUpdateMaskProps)) return;

  if (_needsTabItemsUpdate) {
    _needsTabItemsUpdate = NO;
    [self _rebuildTabItems];
  }

  if (_selectedIndex >= 0 &&
      _selectedIndex < (NSInteger)_tabBar.items.count) {
    _tabBar.selectedItem = _tabBar.items[_selectedIndex];
  }
}

- (void)_rebuildTabItems {
  const auto &viewProps =
      *std::static_pointer_cast<TrueTabsViewProps const>(_props);

  NSMutableArray<UITabBarItem *> *tabItems = [NSMutableArray new];
  for (const auto &item : viewProps.items) {
    NSString *title = [NSString stringWithUTF8String:item.title.c_str()];

    UIImage *image = nil;
    NSString *remoteUri = nil;

    if (!item.sfSymbol.empty()) {
      NSString *symbolName =
          [NSString stringWithUTF8String:item.sfSymbol.c_str()];
      image = [UIImage systemImageNamed:symbolName];
    } else if (!item.iconUri.empty()) {
      NSString *uri = [NSString stringWithUTF8String:item.iconUri.c_str()];
      UIImage *cached = [_imageCache objectForKey:uri];
      if (cached) {
        image = cached;
      } else if ([uri hasPrefix:@"file://"] || [uri hasPrefix:@"/"]) {
        NSString *path =
            [uri hasPrefix:@"file://"] ? [uri substringFromIndex:7] : uri;
        image = [UIImage imageWithContentsOfFile:path];
        if (image) {
          image = [image imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate];
          [_imageCache setObject:image forKey:uri];
        }
      } else {
        remoteUri = uri;
      }
    }

    UITabBarItem *tabItem =
        [[UITabBarItem alloc] initWithTitle:title
                                      image:image
                                        tag:(NSInteger)tabItems.count];

    if (!item.badge.empty()) {
      NSString *badge = [NSString stringWithUTF8String:item.badge.c_str()];
      tabItem.badgeValue = badge;
    }

    if (remoteUri) {
      NSString *uri = remoteUri;
      dispatch_async(dispatch_get_global_queue(QOS_CLASS_USER_INITIATED, 0), ^{
        NSURL *url = [NSURL URLWithString:uri];
        if (!url) return;
        NSData *data = [NSData dataWithContentsOfURL:url];
        if (!data) return;
        UIImage *img = [UIImage imageWithData:data];
        if (!img) return;
        img = [img imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate];
        [_imageCache setObject:img forKey:uri];
        dispatch_async(dispatch_get_main_queue(), ^{
          tabItem.image = img;
        });
      });
    }

    [tabItems addObject:tabItem];
  }
  [_tabBar setItems:tabItems animated:NO];
}

#pragma mark - UITabBarDelegate

- (void)tabBar:(UITabBar *)tabBar didSelectItem:(UITabBarItem *)item {
  NSInteger index = item.tag;
  if (index == _selectedIndex) {
    return;
  }

  _selectedIndex = index;

  const auto &eventEmitter =
      static_cast<const TrueTabsViewEventEmitter &>(*_eventEmitter);
  eventEmitter.onTabSelect({.index = static_cast<int>(index)});
}

@end
