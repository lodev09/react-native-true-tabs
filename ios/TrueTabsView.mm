#import "TrueTabsView.h"

#import <React/RCTConversions.h>

#import <react/renderer/components/TrueTabsViewSpec/ComponentDescriptors.h>
#import <react/renderer/components/TrueTabsViewSpec/EventEmitters.h>
#import <react/renderer/components/TrueTabsViewSpec/Props.h>
#import <react/renderer/components/TrueTabsViewSpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface TrueTabsView () <UITabBarDelegate, RCTTrueTabsViewViewProtocol>
@end

@implementation TrueTabsView {
  UITabBar *_tabBar;
  NSInteger _selectedIndex;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<TrueTabsViewComponentDescriptor>();
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

  {
    NSMutableArray<UITabBarItem *> *tabItems = [NSMutableArray new];
    for (const auto &item : newViewProps.items) {
      NSString *title = [NSString stringWithUTF8String:item.title.c_str()];

      UIImage *image = nil;
      if (!item.sfSymbol.empty()) {
        NSString *symbolName =
            [NSString stringWithUTF8String:item.sfSymbol.c_str()];
        image = [UIImage systemImageNamed:symbolName];
      } else if (!item.iconUri.empty()) {
        NSString *uri = [NSString stringWithUTF8String:item.iconUri.c_str()];
        if ([uri hasPrefix:@"file://"] || [uri hasPrefix:@"/"]) {
          NSString *path =
              [uri hasPrefix:@"file://"] ? [uri substringFromIndex:7] : uri;
          image = [UIImage imageWithContentsOfFile:path];
        } else {
          NSURL *url = [NSURL URLWithString:uri];
          if (url) {
            NSData *data = [NSData dataWithContentsOfURL:url];
            if (data) {
              image = [UIImage imageWithData:data];
            }
          }
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

      [tabItems addObject:tabItem];
    }
    [_tabBar setItems:tabItems animated:NO];

    _selectedIndex = newViewProps.selectedIndex;
    if (_selectedIndex >= 0 &&
        _selectedIndex < (NSInteger)_tabBar.items.count) {
      _tabBar.selectedItem = _tabBar.items[_selectedIndex];
    }
  }

  if (oldViewProps.translucent != newViewProps.translucent) {
    _tabBar.translucent = newViewProps.translucent;
  }

  if (oldViewProps.tintColor != newViewProps.tintColor) {
    if (newViewProps.tintColor) {
      _tabBar.barTintColor = RCTUIColorFromSharedColor(*newViewProps.tintColor);
    } else {
      _tabBar.barTintColor = nil;
    }
  }

  if (oldViewProps.activeTintColor != newViewProps.activeTintColor) {
    if (newViewProps.activeTintColor) {
      _tabBar.tintColor =
          RCTUIColorFromSharedColor(*newViewProps.activeTintColor);
    } else {
      _tabBar.tintColor = nil;
    }
  }

  [super updateProps:props oldProps:oldProps];
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
