import { trigger, animate, transition, style, state, keyframes } from '@angular/animations';

export const flyInOutAnimation =
  trigger('flyInOutAnimation', [
    state('in', style({transform: 'translateY(0)'})),
    transition('void => *', [
      animate(300, keyframes([
        style({opacity: 0, transform: 'translateY(-100%)', offset: 0}),
        style({opacity: 1, transform: 'translateY(15px)',  offset: 0.3}),
        style({opacity: 1, transform: 'translateY(0)',     offset: 1.0})
      ]))
    ]),
    transition('void => false', [
      /*no transition on first load*/
    ]),
    transition('* => void', [
      animate(300, keyframes([
        style({opacity: 1, transform: 'translateY(100%)',     offset: 0}),
        style({opacity: 1, transform: 'translateY(15px)', offset: 0.7}),
        style({opacity: 0, transform: 'translateY(0)',  offset: 1.0})
      ]))
    ])
  ]);
