import { trigger, animate, transition, style, query } from '@angular/animations';

export const fadeAnimation =

    trigger('fadeAnimation', [

        transition( '* => *', [

            query(':enter', 
                [
                    style({ opacity: 0 })
                ], 
                { optional: true }
            ),
            
            query(':enter', 
                [
                    style({ opacity: 0 }),
                    animate(200, style({ opacity: 1 }))
                ], 
                { optional: true }
            )

        ])

    ]);