import { Directive } from "@angular/core";
import { FormGroup, NG_VALIDATORS, ValidationErrors, Validator } from "@angular/forms";

@Directive({
  selector: '[appPasswordsMatch]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: PasswordsMatchDirective,
    multi: true
  }]
})
export class PasswordsMatchDirective implements Validator {

  validate(group: FormGroup): ValidationErrors {
    const passwordsMatch = group.controls.password?.value === group.controls.passwordRepeat?.value;
    console.log('Passwords match:', passwordsMatch);
    
    return !passwordsMatch ? { appPasswordsMatch: true } : null;
  }
  
}