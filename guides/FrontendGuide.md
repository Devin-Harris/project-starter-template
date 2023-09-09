# Frontend guide

This guideline highlights the folder structure and general pattern for the frontend application.

## Folder Structure

The frontend folder structures worth noting follows the following pattern:

- **app**
  - **components**
    _Contains components that are used in multiple places. Things like an avatar component, single/multi select, or generic card would be good candidates for this area_
  - **core**
    _Contains core level services/state/utilities/guards etc... Think of things in this folder as being necessary near or at app bootstrapping (is needed globally regardless of what page you are on)_
  - **features**
    _Contains the individual features/pages our app allows routing for. There may be features that don't have a specific route, but generally anything that can be lazy loaded could be contained as a feature in the features folder._
- **assets**
  _Typically global site imagery such as the app logo or some other file_
- **styles**
  _Contains global style sheets. Any styles here are applied across all components and typically should only be used for declaring variables, screen media query breakpoints, or other theming overrides_

## Facade Service Pattern

Making use of the new angular 16 techniques we are following a facade service approach. This facade service basically defines a way of providing both a state and in some cases a form service to our components making the view separated from the actual logic pulling information from the store/form. We do this through the use of a custom defined FacadeServiceFromSelector/FacadeServiceBase class for state services and using typed-form inferance types for building typed forms on our form services.

##### Facade State Service

<blockquote>
<details>
A typical component may look something like this:

```
@Component({
  selector: 'layout',
  standalone: true,
  imports: [],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  readonly navbarStateService = inject(NavbarStateService);
}
```

Here you see the `navbarStateService` in injected at the component level. This facade service could be defined like this:

```
@Injectable({
  providedIn: 'root',
})
export class NavbarStateService extends FacadeServiceFromSelector(
  getNavigationState
) {
  ...
}
```

With the getNavigationState being a selector like:

```
export const getNavigationState = createSelector(
  selectLayoutState,
  selectNavLinks,
  (state, navlinks) => {
    return {
      ...state,
      navlinks,
      activeItem: navlinks.find((a) => a.isActive) ?? [],
      isMobile: state.breakpoint === Breakpoints.Mobile,
      isTablet: state.breakpoint === Breakpoints.Tablet,
      isLaptop: state.breakpoint === Breakpoints.Laptop,
      isDesktop: state.breakpoint === Breakpoints.Desktop,
    };
  }
);
```

In this example you can see how the processing logic is done on the selector level. This is beneficial because the selector will already be observing any changes from the slices of state it is consuming to trigger updates through our facade service.

:warning: It also allows us to consume multiple pieces of state at once through a single service instead of injecting multiple services for each different slice of state we want. You need to be careful doing this though, as consuming a lazily loaded piece of state could run into the event where some state pieces are undefined when you arent expecting them to be

After you have the facade service you can use the `$data` signal to pull values off the selector any where you want (yes even in the html):

```
...
<ul
   *ngIf="
      !navbarStateService.$data().isMobile ||
      navbarStateService.$data().expanded
   "
>
   <li *ngFor="let item of navbarStateService.$data().navlinks">
      <a
         [routerLink]="item.routerLink"
         [queryParamsHandling]="item.queryParamsHandling"
         routerLinkActive="active-page"
         [class.has-icon]="!!item.icon"
      >
         <mat-icon *ngIf="!navbarStateService.$data().expanded || item.icon">{{
            item.icon
         }}</mat-icon>
         <div
            *ngIf="navbarStateService.$data().expanded"
            class="nav-item-text menu-item-wrapper"
         >
            <div class="menu-item-title">{{ item.name }}</div>
         </div>
      </a>
   </li>
</ul>
...
```

See more about angular signals and their benefits: https://angular.io/guide/signals

</details>
</blockquote>

##### Form Service Pattern

<blockquote>
<details>
Like the state service pattern the form service patterns goal is to move logic out of the component (it can also allow sharing of the same form object between multiple components without the need of inputs and outputs but that is a more case by case basis).

A typical form service may look something like this:

```
export interface PasswordInputsFormValue {
  confirmNewPassword: string | null;
  newPassword: string | null;
}

@Injectable()
export class PasswordFormService {

  form = new FormGroup<ControlsOf<PasswordInputsFormValue>>({
      confirmNewPassword: null as string | null,
      newPassword: null as string | null,
  });

  initialize(value: PasswordInputsFormValue) {
    this.form.reset(value);
  }

  getFormValue(): WithStatus<PasswordInputsFormValue> {
    const allFields = Object.keys(
      this.form.controls
    ) as (keyof PasswordInputsFormValue)[];
    const dirtyFields: (keyof PasswordInputsFormValue)[] = allFields.filter(
      (k) => this.form.get(k)?.dirty
    );
    return {
      ...this.form.getRawValue(),
      valid: this.form.valid,
      dirty: this.form.dirty,
      dirtyFields,
    };
  }
}
```

Note the use of the `ControlsOf` and the `WithStatus` helper types. These types help us infer the typed form controls and the formValue responses of our form while only forcing us to define a single `PasswordInputsFormValue` interface. This drastically cuts down on the number of interfaces we have to maintain and keeps our code fairly simple on the component level when we register form submittion events:

```
@Component({
  selector: 'passwords-form',
  standalone: true,
  imports: [...],
  templateUrl: './passwords-form.html',
  styleUrls: ['./passwords-form.scss'],
})
export class PasswordFormComponent {
  readonly stateService = inject(AuthenticationStateService);

  readonly formService = inject(PasswordFormService);

  readonly formInitializationEffect = effect(() => {
    const data = this.stateService.$data();
    if (data) {
      const value: PasswordInputsFormValue = {
         confirmNewPassword: data.confirmNewPassword,
         newPassword: data.newPassword,
      };
      this.formService.initialize(value);
    }
  });

  constructor() {
    this.stateService.initialize();
  }

  saveNewPassword() {
    const formValue = this.formService.getFormValue();
    if (formValue.dirty && formValue.valid) {
      this.stateService.saveNewPassword(formValue);
    }
  }
}
```

</details>
</blockquote>

## Serving/Deploying

As mentioned above the frontend is using angular version 16 alongside various other dependencies. To serve the frontend you can use the angular cli (if you have it installed globally):
`cd {path to frontend folder}` &rarr; `ng serve`
or you can use the vscode task created:
`CTRL+SHIFT+P` &rarr; `Tasks: Run Task` &rarr; `Client`
_The client is also served alongside the backend when you run the `Dev` task as well_
