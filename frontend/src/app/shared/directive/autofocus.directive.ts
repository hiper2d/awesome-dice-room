import {Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
    selector: '[autofocus]'
})
export class AutofocusDirective implements OnInit {
    @Input() focus = true;

    constructor(private el: ElementRef) {}

    ngOnInit() {
        if (this.focus) {
            window.setTimeout(() => this.el.nativeElement.focus());
        }
    }
}
