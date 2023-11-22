import { animate, query, style, transition, trigger } from "@angular/animations";

export const slideOver = trigger('routeAnimation', [
  transition('landing => login', slideOverFrom('top')),
  transition('login => landing', slideOutTo('top')),
  transition('home => settings', slideOverFrom('right')),
  transition('settings => home', slideOutTo('right')),
  transition('home => tracks', slideOverFrom('left')),
  transition('tracks => home', slideOutTo('left')),
]);

function slideOverFrom(direction: 'top' | 'bottom' | 'right' | 'left') {
  const optional = { optional: true };
  const otherDir = (direction === 'top' || direction === 'bottom') ? { left: 0 } : { top: 0 };
  return [
    query(':enter', [
      style({
        position: 'absolute',
        ...otherDir,
        [direction]: '-100%',
        width: '100%',
        "z-index": 2
      }),
      animate('200ms ease-out',
        style({
          [direction]: 0
        })
      )
    ], optional),
    query(':leave', animate('200ms'), optional)
  ];
}

function slideOutTo(direction: 'top' | 'bottom' | 'right' | 'left') {
  const optional = { optional: true };
  const otherDir = (direction === 'top' || direction === 'bottom') ? { left: 0 } : { top: 0 };
  return [
    query(':leave', [
      style({
        position: 'absolute',
        ...otherDir,
        [direction]: 0,
        width: '100%',
        "z-index": 2
      }),
      animate('200ms ease-in',
        style({
          [direction]: '-100%'
        })
      )
    ], optional)
  ];
}
