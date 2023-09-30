import { Directive } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from "@angular/forms";

@Directive({
  selector: '[appValidName]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: ValidNameDirective,
    multi: true
  }]
})
export class ValidNameDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors {
    const name: string = control.value?.trim();

    //const isNameValid = /^\p{L}+$/gu.test(name);
    const isNameValid = name?.length > 0;

    return !isNameValid ? { appValidName: true } : null;
  }
}