/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { EventEmitter } from '@angular/core';
import { composeAsyncValidators, composeValidators } from './directives/shared';
import { toObservable } from './validators';
/**
 * Reports that a FormControl is valid, meaning that no errors exist in the input value.
 *
 * @see `status`
 */
export var VALID = 'VALID';
/**
 * Reports that a FormControl is invalid, meaning that an error exists in the input value.
 *
 * @see `status`
 */
export var INVALID = 'INVALID';
/**
 * Reports that a FormControl is pending, meaning that that async validation is occurring and
 * errors are not yet available for the input value.
 *
 * @see `markAsPending`
 * @see `status`
 */
export var PENDING = 'PENDING';
/**
 * Reports that a FormControl is disabled, meaning that the control is exempt from ancestor
 * calculations of validity or value.
 *
 * @see `markAsDisabled`
 * @see `status`
 */
export var DISABLED = 'DISABLED';
function _find(control, path, delimiter) {
    if (path == null)
        return null;
    if (!(path instanceof Array)) {
        path = path.split(delimiter);
    }
    if (path instanceof Array && (path.length === 0))
        return null;
    return path.reduce(function (v, name) {
        if (v instanceof FormGroup) {
            return v.controls.hasOwnProperty(name) ? v.controls[name] : null;
        }
        if (v instanceof FormArray) {
            return v.at(name) || null;
        }
        return null;
    }, control);
}
function coerceToValidator(validatorOrOpts) {
    var validator = (isOptionsObj(validatorOrOpts) ? validatorOrOpts.validators :
        validatorOrOpts);
    return Array.isArray(validator) ? composeValidators(validator) : validator || null;
}
function coerceToAsyncValidator(asyncValidator, validatorOrOpts) {
    var origAsyncValidator = (isOptionsObj(validatorOrOpts) ? validatorOrOpts.asyncValidators :
        asyncValidator);
    return Array.isArray(origAsyncValidator) ? composeAsyncValidators(origAsyncValidator) :
        origAsyncValidator || null;
}
function isOptionsObj(validatorOrOpts) {
    return validatorOrOpts != null && !Array.isArray(validatorOrOpts) &&
        typeof validatorOrOpts === 'object';
}
/**
 * This is the base class for `FormControl`, `FormGroup`, and `FormArray`.
 *
 * It provides some of the shared behavior that all controls and groups of controls have, like
 * running validators, calculating status, and resetting state. It also defines the properties
 * that are shared between all sub-classes, like `value`, `valid`, and `dirty`. It shouldn't be
 * instantiated directly.
 *
 * @see [Forms Guide](/guide/forms)
 * @see [Reactive Forms Guide](/guide/reactive-forms)
 * @see [Dynamic Forms Guide](/guide/dynamic-form)
 *
 */
var AbstractControl = /** @class */ (function () {
    /**
     * Initialize the AbstractControl instance.
     *
     * @param validator The function that determines the synchronous validity of this control.
     * @param asyncValidator The function that determines the asynchronous validity of this
     * control.
     */
    function AbstractControl(validator, asyncValidator) {
        this.validator = validator;
        this.asyncValidator = asyncValidator;
        /** @internal */
        this._onCollectionChange = function () { };
        /**
         * A control is `pristine` if the user has not yet changed
         * the value in the UI.
         *
         * @returns True if the user has not yet changed the value in the UI; compare `dirty`.
         * Programmatic changes to a control's value do not mark it dirty.
         */
        this.pristine = true;
        /**
         * True if the control is marked as `touched`.
         *
         * A control is marked `touched` once the user has triggered
         * a `blur` event on it.
         */
        this.touched = false;
        /** @internal */
        this._onDisabledChange = [];
    }
    Object.defineProperty(AbstractControl.prototype, "parent", {
        /**
         * The parent control.
         */
        get: function () { return this._parent; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "valid", {
        /**
         * A control is `valid` when its `status` is `VALID`.
         *
         * @see `status`
         *
         * @returns True if the control has passed all of its validation tests,
         * false otherwise.
         */
        get: function () { return this.status === VALID; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "invalid", {
        /**
         * A control is `invalid` when its `status` is `INVALID`.
         *
         * @see `status`
         *
         * @returns True if this control has failed one or more of its validation checks,
         * false otherwise.
         */
        get: function () { return this.status === INVALID; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "pending", {
        /**
         * A control is `pending` when its `status` is `PENDING`.
         *
         * @see `status`
         *
         * @returns True if this control is in the process of conducting a validation check,
         * false otherwise.
         */
        get: function () { return this.status == PENDING; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "disabled", {
        /**
         * A control is `disabled` when its `status` is `DISABLED`.
         *
         * @see `status`
         *
         * Disabled controls are exempt from validation checks and
         * are not included in the aggregate value of their ancestor
         * controls.
         *
         * @returns True if the control is disabled, false otherwise.
         */
        get: function () { return this.status === DISABLED; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "enabled", {
        /**
         * A control is `enabled` as long as its `status` is not `DISABLED`.
         *
         * @see `status`
         *
         * @returns True if the control has any status other than 'DISABLED',
         * false if the status is 'DISABLED'.
         *
         */
        get: function () { return this.status !== DISABLED; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "dirty", {
        /**
         * A control is `dirty` if the user has changed the value
         * in the UI.
         *
         * @returns True if the user has changed the value of this control in the UI; compare `pristine`.
         * Programmatic changes to a control's value do not mark it dirty.
         */
        get: function () { return !this.pristine; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "untouched", {
        /**
         * True if the control has not been marked as touched
         *
         * A control is `untouched` if the user has not yet triggered
         * a `blur` event on it.
         */
        get: function () { return !this.touched; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "updateOn", {
        /**
         * Reports the update strategy of the `AbstractControl` (meaning
         * the event on which the control updates itself).
         * Possible values: `'change'` | `'blur'` | `'submit'`
         * Default value: `'change'`
         */
        get: function () {
            return this._updateOn ? this._updateOn : (this.parent ? this.parent.updateOn : 'change');
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the synchronous validators that are active on this control.  Calling
     * this overwrites any existing sync validators.
     */
    AbstractControl.prototype.setValidators = function (newValidator) {
        this.validator = coerceToValidator(newValidator);
    };
    /**
     * Sets the async validators that are active on this control. Calling this
     * overwrites any existing async validators.
     */
    AbstractControl.prototype.setAsyncValidators = function (newValidator) {
        this.asyncValidator = coerceToAsyncValidator(newValidator);
    };
    /**
     * Empties out the sync validator list.
     */
    AbstractControl.prototype.clearValidators = function () { this.validator = null; };
    /**
     * Empties out the async validator list.
     */
    AbstractControl.prototype.clearAsyncValidators = function () { this.asyncValidator = null; };
    /**
     * Marks the control as `touched`. A control is touched by focus and
     * blur events that do not change the value; compare `markAsDirty`;
     *
     *  @param opts Configuration options that determine how the control propagates changes
     * and emits events events after marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     */
    AbstractControl.prototype.markAsTouched = function (opts) {
        if (opts === void 0) { opts = {}; }
        this.touched = true;
        if (this._parent && !opts.onlySelf) {
            this._parent.markAsTouched(opts);
        }
    };
    /**
     * Marks the control as `untouched`.
     *
     * If the control has any children, also marks all children as `untouched`
     * and recalculates the `touched` status of all parent controls.
     *
     *  @param opts Configuration options that determine how the control propagates changes
     * and emits events after the marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     */
    AbstractControl.prototype.markAsUntouched = function (opts) {
        if (opts === void 0) { opts = {}; }
        this.touched = false;
        this._pendingTouched = false;
        this._forEachChild(function (control) { control.markAsUntouched({ onlySelf: true }); });
        if (this._parent && !opts.onlySelf) {
            this._parent._updateTouched(opts);
        }
    };
    /**
     * Marks the control as `dirty`. A control becomes dirty when
     * the control's is changed through the UI; compare `markAsTouched`.
     *
     *  @param opts Configuration options that determine how the control propagates changes
     * and emits events after marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     */
    AbstractControl.prototype.markAsDirty = function (opts) {
        if (opts === void 0) { opts = {}; }
        this.pristine = false;
        if (this._parent && !opts.onlySelf) {
            this._parent.markAsDirty(opts);
        }
    };
    /**
     * Marks the control as `pristine`.
     *
     * If the control has any children, marks all children as `pristine`,
     * and recalculates the `pristine` status of all parent
     * controls.
     *
     *  @param opts Configuration options that determine how the control emits events after
     * marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false..
     */
    AbstractControl.prototype.markAsPristine = function (opts) {
        if (opts === void 0) { opts = {}; }
        this.pristine = true;
        this._pendingDirty = false;
        this._forEachChild(function (control) { control.markAsPristine({ onlySelf: true }); });
        if (this._parent && !opts.onlySelf) {
            this._parent._updatePristine(opts);
        }
    };
    /**
     * Marks the control as `pending`.
     *
     * A control is pending while the control performs async validation.
     *
     *  @param opts Configuration options that determine how the control propagates changes and
     * emits events after marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false..
     * * `emitEvent`: When true or not supplied (the default), the `statusChanges`
     * observable emits an event with the latest status the control is marked pending.
     * When false, no events are emitted.
     *
     */
    AbstractControl.prototype.markAsPending = function (opts) {
        if (opts === void 0) { opts = {}; }
        this.status = PENDING;
        if (opts.emitEvent !== false) {
            this.statusChanges.emit(this.status);
        }
        if (this._parent && !opts.onlySelf) {
            this._parent.markAsPending(opts);
        }
    };
    /**
     * Disables the control. This means the control is exempt from validation checks and
     * excluded from the aggregate value of any parent. Its status is `DISABLED`.
     *
     * If the control has children, all children are also disabled.
     *
     *  @param opts Configuration options that determine how the control propagates
     * changes and emits events after the control is disabled.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false..
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is disabled.
     * When false, no events are emitted.
     */
    AbstractControl.prototype.disable = function (opts) {
        if (opts === void 0) { opts = {}; }
        this.status = DISABLED;
        this.errors = null;
        this._forEachChild(function (control) { control.disable(tslib_1.__assign({}, opts, { onlySelf: true })); });
        this._updateValue();
        if (opts.emitEvent !== false) {
            this.valueChanges.emit(this.value);
            this.statusChanges.emit(this.status);
        }
        this._updateAncestors(opts);
        this._onDisabledChange.forEach(function (changeFn) { return changeFn(true); });
    };
    /**
     * Enables the control. This means the control is included in validation checks and
     * the aggregate value of its parent. Its status recalculates based on its value and
     * its validators.
     *
     * By default, if the control has children, all children are enabled.
     *
     *  @param opts Configure options that control how the control propagates changes and
     * emits events when marked as untouched
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false..
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is enabled.
     * When false, no events are emitted.
     */
    AbstractControl.prototype.enable = function (opts) {
        if (opts === void 0) { opts = {}; }
        this.status = VALID;
        this._forEachChild(function (control) { control.enable(tslib_1.__assign({}, opts, { onlySelf: true })); });
        this.updateValueAndValidity({ onlySelf: true, emitEvent: opts.emitEvent });
        this._updateAncestors(opts);
        this._onDisabledChange.forEach(function (changeFn) { return changeFn(false); });
    };
    AbstractControl.prototype._updateAncestors = function (opts) {
        if (this._parent && !opts.onlySelf) {
            this._parent.updateValueAndValidity(opts);
            this._parent._updatePristine();
            this._parent._updateTouched();
        }
    };
    /**
     * @param parent Sets the parent of the control
     */
    AbstractControl.prototype.setParent = function (parent) { this._parent = parent; };
    /**
     * Recalculates the value and validation status of the control.
     *
     * By default, it also updates the value and validity of its ancestors.
     *
     * @param opts Configuration options determine how the control propagates changes and emits events
     * after updates and validity checks are applied.
     * * `onlySelf`: When true, only update this control. When false or not supplied,
     * update all direct ancestors. Default is false..
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is updated.
     * When false, no events are emitted.
     */
    AbstractControl.prototype.updateValueAndValidity = function (opts) {
        if (opts === void 0) { opts = {}; }
        this._setInitialStatus();
        this._updateValue();
        if (this.enabled) {
            this._cancelExistingSubscription();
            this.errors = this._runValidator();
            this.status = this._calculateStatus();
            if (this.status === VALID || this.status === PENDING) {
                this._runAsyncValidator(opts.emitEvent);
            }
        }
        if (opts.emitEvent !== false) {
            this.valueChanges.emit(this.value);
            this.statusChanges.emit(this.status);
        }
        if (this._parent && !opts.onlySelf) {
            this._parent.updateValueAndValidity(opts);
        }
    };
    /** @internal */
    AbstractControl.prototype._updateTreeValidity = function (opts) {
        if (opts === void 0) { opts = { emitEvent: true }; }
        this._forEachChild(function (ctrl) { return ctrl._updateTreeValidity(opts); });
        this.updateValueAndValidity({ onlySelf: true, emitEvent: opts.emitEvent });
    };
    AbstractControl.prototype._setInitialStatus = function () {
        this.status = this._allControlsDisabled() ? DISABLED : VALID;
    };
    AbstractControl.prototype._runValidator = function () {
        return this.validator ? this.validator(this) : null;
    };
    AbstractControl.prototype._runAsyncValidator = function (emitEvent) {
        var _this = this;
        if (this.asyncValidator) {
            this.status = PENDING;
            var obs = toObservable(this.asyncValidator(this));
            this._asyncValidationSubscription =
                obs.subscribe(function (errors) { return _this.setErrors(errors, { emitEvent: emitEvent }); });
        }
    };
    AbstractControl.prototype._cancelExistingSubscription = function () {
        if (this._asyncValidationSubscription) {
            this._asyncValidationSubscription.unsubscribe();
        }
    };
    /**
     * Sets errors on a form control when running validations manually, rather than automatically.
     *
     * Calling `setErrors` also updates the validity of the parent control.
     *
     * ### Manually set the errors for a control
     *
     * ```
     * const login = new FormControl('someLogin');
     * login.setErrors({
     *   notUnique: true
     * });
     *
     * expect(login.valid).toEqual(false);
     * expect(login.errors).toEqual({ notUnique: true });
     *
     * login.setValue('someOtherLogin');
     *
     * expect(login.valid).toEqual(true);
     * ```
     */
    AbstractControl.prototype.setErrors = function (errors, opts) {
        if (opts === void 0) { opts = {}; }
        this.errors = errors;
        this._updateControlsErrors(opts.emitEvent !== false);
    };
    /**
     * Retrieves a child control given the control's name or path.
     *
     * @param path A dot-delimited string or array of string/number values that define the path to the
     * control.
     *
     * ### Retrieve a nested control
     *
     * For example, to get a `name` control nested within a `person` sub-group:
     *
     * * `this.form.get('person.name');`
     *
     * -OR-
     *
     * * `this.form.get(['person', 'name']);`
     */
    AbstractControl.prototype.get = function (path) { return _find(this, path, '.'); };
    /**
     * Reports error data for a specific error occurring in this control or in another control.
     *
     * @param errorCode The error code for which to retrieve data
     * @param path The path to a control to check. If not supplied, checks for the error in this
     * control.
     *
     * @returns The error data if the control with the given path has the given error, otherwise null
     * or undefined.
     */
    AbstractControl.prototype.getError = function (errorCode, path) {
        var control = path ? this.get(path) : this;
        return control && control.errors ? control.errors[errorCode] : null;
    };
    /**
     * Reports whether the control with the given path has the error specified.
     *
     * @param errorCode The error code for which to retrieve data
     * @param path The path to a control to check. If not supplied, checks for the error in this
     * control.
     * @returns True when the control with the given path has the error, otherwise false.
     */
    AbstractControl.prototype.hasError = function (errorCode, path) { return !!this.getError(errorCode, path); };
    Object.defineProperty(AbstractControl.prototype, "root", {
        /**
         * Retrieves the top-level ancestor of this control.
         */
        get: function () {
            var x = this;
            while (x._parent) {
                x = x._parent;
            }
            return x;
        },
        enumerable: true,
        configurable: true
    });
    /** @internal */
    AbstractControl.prototype._updateControlsErrors = function (emitEvent) {
        this.status = this._calculateStatus();
        if (emitEvent) {
            this.statusChanges.emit(this.status);
        }
        if (this._parent) {
            this._parent._updateControlsErrors(emitEvent);
        }
    };
    /** @internal */
    AbstractControl.prototype._initObservables = function () {
        this.valueChanges = new EventEmitter();
        this.statusChanges = new EventEmitter();
    };
    AbstractControl.prototype._calculateStatus = function () {
        if (this._allControlsDisabled())
            return DISABLED;
        if (this.errors)
            return INVALID;
        if (this._anyControlsHaveStatus(PENDING))
            return PENDING;
        if (this._anyControlsHaveStatus(INVALID))
            return INVALID;
        return VALID;
    };
    /** @internal */
    AbstractControl.prototype._anyControlsHaveStatus = function (status) {
        return this._anyControls(function (control) { return control.status === status; });
    };
    /** @internal */
    AbstractControl.prototype._anyControlsDirty = function () {
        return this._anyControls(function (control) { return control.dirty; });
    };
    /** @internal */
    AbstractControl.prototype._anyControlsTouched = function () {
        return this._anyControls(function (control) { return control.touched; });
    };
    /** @internal */
    AbstractControl.prototype._updatePristine = function (opts) {
        if (opts === void 0) { opts = {}; }
        this.pristine = !this._anyControlsDirty();
        if (this._parent && !opts.onlySelf) {
            this._parent._updatePristine(opts);
        }
    };
    /** @internal */
    AbstractControl.prototype._updateTouched = function (opts) {
        if (opts === void 0) { opts = {}; }
        this.touched = this._anyControlsTouched();
        if (this._parent && !opts.onlySelf) {
            this._parent._updateTouched(opts);
        }
    };
    /** @internal */
    AbstractControl.prototype._isBoxedValue = function (formState) {
        return typeof formState === 'object' && formState !== null &&
            Object.keys(formState).length === 2 && 'value' in formState && 'disabled' in formState;
    };
    /** @internal */
    AbstractControl.prototype._registerOnCollectionChange = function (fn) { this._onCollectionChange = fn; };
    /** @internal */
    AbstractControl.prototype._setUpdateStrategy = function (opts) {
        if (isOptionsObj(opts) && opts.updateOn != null) {
            this._updateOn = opts.updateOn;
        }
    };
    return AbstractControl;
}());
export { AbstractControl };
/**
 * Tracks the value and validation status of an individual form control.
 *
 * This is one of the three fundamental building blocks of Angular forms, along with
 * `FormGroup` and `FormArray`. It extends the `AbstractControl` class that
 * implements most of the base functionality for accessing the value, validation status,
 * user interactions and events.
 *
 * @see `AbstractControl`
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see [Usage Notes](#usage-notes)
 *
 * @usageNotes
 *
 * ### Initializing Form Controls
 *
 * Instantiate a `FormControl`, with an initial value.
 *
 * ```ts
 * const control = new FormControl('some value');
 * console.log(control.value);     // 'some value'
 *```
 *
 * The following example initializes the control with a form state object. The `value`
 * and `disabled` keys are required in this case.
 *
 * ```ts
 * const control = new FormControl({ value: 'n/a', disabled: true });
 * console.log(control.value);     // 'n/a'
 * console.log(control.status);    // 'DISABLED'
 * ```
 *
 * The following example initializes the control with a sync validator.
 *
 * ```ts
 * const control = new FormControl('', Validators.required);
 * console.log(control.value);      // ''
 * console.log(control.status);     // 'INVALID'
 * ```
 *
 * The following example initializes the control using an options object.
 *
 * ```ts
 * const control = new FormControl('', {
 *    validators: Validators.required,
 *    asyncValidators: myAsyncValidator
 * });
 * ```
 *
 * ### Configure the control to update on a blur event
 *
 * Set the `updateOn` option to `'blur'` to update on the blur `event`.
 *
 * ```ts
 * const control = new FormControl('', { updateOn: 'blur' });
 * ```
 *
 * ### Configure the control to update on a submit event
 *
 * Set the `updateOn` option to `'submit'` to update on a submit `event`.
 *
 * ```ts
 * const control = new FormControl('', { updateOn: 'submit' });
 * ```
 *
 * ### Reset the control back to an initial value
 *
 * You reset to a specific form state by passing through a standalone
 * value or a form state object that contains both a value and a disabled state
 * (these are the only two properties that cannot be calculated).
 *
 * ```ts
 * const control = new FormControl('Nancy');
 *
 * console.log(control.value); // 'Nancy'
 *
 * control.reset('Drew');
 *
 * console.log(control.value); // 'Drew'
 * ```
 *
 * ### Reset the control back to an initial value and disabled
 *
 * ```
 * const control = new FormControl('Nancy');
 *
 * console.log(control.value); // 'Nancy'
 * console.log(control.status); // 'VALID'
 *
 * control.reset({ value: 'Drew', disabled: true });
 *
 * console.log(control.value); // 'Drew'
 * console.log(control.status); // 'DISABLED'
 *
*/
var FormControl = /** @class */ (function (_super) {
    tslib_1.__extends(FormControl, _super);
    /**
    * Creates a new `FormControl` instance.
    *
    * @param formState Initializes the control with an initial value,
    * or an object that defines the initial value and disabled state.
    *
    * @param validatorOrOpts A synchronous validator function, or an array of
    * such functions, or an `AbstractControlOptions` object that contains validation functions
    * and a validation trigger.
    *
    * @param asyncValidator A single async validator or array of async validator functions
    *
    */
    function FormControl(formState, validatorOrOpts, asyncValidator) {
        if (formState === void 0) { formState = null; }
        var _this = _super.call(this, coerceToValidator(validatorOrOpts), coerceToAsyncValidator(asyncValidator, validatorOrOpts)) || this;
        /** @internal */
        _this._onChange = [];
        _this._applyFormState(formState);
        _this._setUpdateStrategy(validatorOrOpts);
        _this.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        _this._initObservables();
        return _this;
    }
    /**
     * Sets a new value for the form control.
     *
     * @param value The new value for the control.
     * @param options Configuration options that determine how the control proopagates changes
     * and emits events when the value changes.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
     * false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control value is updated.
     * When false, no events are emitted.
     * * `emitModelToViewChange`: When true or not supplied  (the default), each change triggers an
     * `onChange` event to
     * update the view.
     * * `emitViewToModelChange`: When true or not supplied (the default), each change triggers an
     * `ngModelChange`
     * event to update the model.
     *
     */
    FormControl.prototype.setValue = function (value, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.value = this._pendingValue = value;
        if (this._onChange.length && options.emitModelToViewChange !== false) {
            this._onChange.forEach(function (changeFn) { return changeFn(_this.value, options.emitViewToModelChange !== false); });
        }
        this.updateValueAndValidity(options);
    };
    /**
     * Patches the value of a control.
     *
     * This function is functionally the same as {@link FormControl#setValue setValue} at this level.
     * It exists for symmetry with {@link FormGroup#patchValue patchValue} on `FormGroups` and
     * `FormArrays`, where it does behave differently.
     *
     * @see `setValue` for options
     */
    FormControl.prototype.patchValue = function (value, options) {
        if (options === void 0) { options = {}; }
        this.setValue(value, options);
    };
    /**
     * Resets the form control, marking it `pristine` and `untouched`, and setting
     * the value to null.
     *
     * @param formState Resets the control with an initial value,
     * or an object that defines the initial value and disabled state.
     *
     * @param options Configuration options that determine how the control propagates changes
     * and emits events after the value changes.
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
     * false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is reset.
     * When false, no events are emitted.
     *
     */
    FormControl.prototype.reset = function (formState, options) {
        if (formState === void 0) { formState = null; }
        if (options === void 0) { options = {}; }
        this._applyFormState(formState);
        this.markAsPristine(options);
        this.markAsUntouched(options);
        this.setValue(this.value, options);
        this._pendingChange = false;
    };
    /**
     * @internal
     */
    FormControl.prototype._updateValue = function () { };
    /**
     * @internal
     */
    FormControl.prototype._anyControls = function (condition) { return false; };
    /**
     * @internal
     */
    FormControl.prototype._allControlsDisabled = function () { return this.disabled; };
    /**
     * Register a listener for change events.
     *
     * @param fn The method that is called when the value changes
     */
    FormControl.prototype.registerOnChange = function (fn) { this._onChange.push(fn); };
    /**
     * @internal
     */
    FormControl.prototype._clearChangeFns = function () {
        this._onChange = [];
        this._onDisabledChange = [];
        this._onCollectionChange = function () { };
    };
    /**
     * Register a listener for disabled events.
     *
     * @param fn The method that is called when the disabled status changes.
     */
    FormControl.prototype.registerOnDisabledChange = function (fn) {
        this._onDisabledChange.push(fn);
    };
    /**
     * @internal
     */
    FormControl.prototype._forEachChild = function (cb) { };
    /** @internal */
    FormControl.prototype._syncPendingControls = function () {
        if (this.updateOn === 'submit') {
            if (this._pendingDirty)
                this.markAsDirty();
            if (this._pendingTouched)
                this.markAsTouched();
            if (this._pendingChange) {
                this.setValue(this._pendingValue, { onlySelf: true, emitModelToViewChange: false });
                return true;
            }
        }
        return false;
    };
    FormControl.prototype._applyFormState = function (formState) {
        if (this._isBoxedValue(formState)) {
            this.value = this._pendingValue = formState.value;
            formState.disabled ? this.disable({ onlySelf: true, emitEvent: false }) :
                this.enable({ onlySelf: true, emitEvent: false });
        }
        else {
            this.value = this._pendingValue = formState;
        }
    };
    return FormControl;
}(AbstractControl));
export { FormControl };
/**
 * Tracks the value and validity state of a group of `FormControl` instances.
 *
 * A `FormGroup` aggregates the values of each child `FormControl` into one object,
 * with each control name as the key.  It calculates its status by reducing the status values
 * of its children. For example, if one of the controls in a group is invalid, the entire
 * group becomes invalid.
 *
 * `FormGroup` is one of the three fundamental building blocks used to define forms in Angular,
 * along with `FormControl` and `FormArray`.
 *
 * When instantiating a `FormGroup`, pass in a collection of child controls as the first
 * argument. The key for each child registers the name for the control.
 *
 * @usageNotes
 *
 * ### Create a form group with 2 controls
 *
 * ```
 * const form = new FormGroup({
 *   first: new FormControl('Nancy', Validators.minLength(2)),
 *   last: new FormControl('Drew'),
 * });
 *
 * console.log(form.value);   // {first: 'Nancy', last; 'Drew'}
 * console.log(form.status);  // 'VALID'
 * ```
 *
 * ### Create a form group with a group-level validator
 *
 * You include group-level validators as the second arg, or group-level async
 * validators as the third arg. These come in handy when you want to perform validation
 * that considers the value of more than one child control.
 *
 * ```
 * const form = new FormGroup({
 *   password: new FormControl('', Validators.minLength(2)),
 *   passwordConfirm: new FormControl('', Validators.minLength(2)),
 * }, passwordMatchValidator);
 *
 *
 * function passwordMatchValidator(g: FormGroup) {
 *    return g.get('password').value === g.get('passwordConfirm').value
 *       ? null : {'mismatch': true};
 * }
 * ```
 *
 * Like `FormControl` instances, you choose to pass in
 * validators and async validators as part of an options object.
 *
 * ```
 * const form = new FormGroup({
 *   password: new FormControl('')
 *   passwordConfirm: new FormControl('')
 * }, { validators: passwordMatchValidator, asyncValidators: otherValidator });
 * ```
 *
 * ### Set the updateOn property for all controls in a form group
 *
 * The options object is used to set a default value for each child
 * control's `updateOn` property. If you set `updateOn` to `'blur'` at the
 * group level, all child controls default to 'blur', unless the child
 * has explicitly specified a different `updateOn` value.
 *
 * ```ts
 * const c = new FormGroup({
 *   one: new FormControl()
 * }, { updateOn: 'blur' });
 * ```
 */
var FormGroup = /** @class */ (function (_super) {
    tslib_1.__extends(FormGroup, _super);
    /**
    * Creates a new `FormGroup` instance.
    *
    * @param controls A collection of child controls. The key for each child is the name
    * under which it is registered.
    *
    * @param validatorOrOpts A synchronous validator function, or an array of
    * such functions, or an `AbstractControlOptions` object that contains validation functions
    * and a validation trigger.
    *
    * @param asyncValidator A single async validator or array of async validator functions
    *
    */
    function FormGroup(controls, validatorOrOpts, asyncValidator) {
        var _this = _super.call(this, coerceToValidator(validatorOrOpts), coerceToAsyncValidator(asyncValidator, validatorOrOpts)) || this;
        _this.controls = controls;
        _this._initObservables();
        _this._setUpdateStrategy(validatorOrOpts);
        _this._setUpControls();
        _this.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        return _this;
    }
    /**
     * Registers a control with the group's list of controls.
     *
     * This method does not update the value or validity of the control.
     * Use {@link FormGroup#addControl addControl} instead.
     *
     * @param name The control name to register in the collection
     * @param control Provides the control for the given name
     */
    FormGroup.prototype.registerControl = function (name, control) {
        if (this.controls[name])
            return this.controls[name];
        this.controls[name] = control;
        control.setParent(this);
        control._registerOnCollectionChange(this._onCollectionChange);
        return control;
    };
    /**
     * Add a control to this group.
     *
     * This method also updates the value and validity of the control.
     *
     * @param name The control name to add to the collection
     * @param control Provides the control for the given name
     */
    FormGroup.prototype.addControl = function (name, control) {
        this.registerControl(name, control);
        this.updateValueAndValidity();
        this._onCollectionChange();
    };
    /**
     * Remove a control from this group.
     *
     * @param name The control name to remove from the collection
     */
    FormGroup.prototype.removeControl = function (name) {
        if (this.controls[name])
            this.controls[name]._registerOnCollectionChange(function () { });
        delete (this.controls[name]);
        this.updateValueAndValidity();
        this._onCollectionChange();
    };
    /**
     * Replace an existing control.
     *
     * @param name The control name to replace in the collection
     * @param control Provides the control for the given name
     */
    FormGroup.prototype.setControl = function (name, control) {
        if (this.controls[name])
            this.controls[name]._registerOnCollectionChange(function () { });
        delete (this.controls[name]);
        if (control)
            this.registerControl(name, control);
        this.updateValueAndValidity();
        this._onCollectionChange();
    };
    /**
     * Check whether there is an enabled control with the given name in the group.
     *
     * Reports false for disabled controls. If you'd like to check for existence in the group
     * only, use {@link AbstractControl#get get} instead.
     *
     * @param name The control name to check for existence in the collection
     *
     * @returns false for disabled controls, true otherwise.
     */
    FormGroup.prototype.contains = function (controlName) {
        return this.controls.hasOwnProperty(controlName) && this.controls[controlName].enabled;
    };
    /**
     * Sets the value of the `FormGroup`. It accepts an object that matches
     * the structure of the group, with control names as keys.
     *
     * ### Set the complete value for the form group
     *
     * ```
     * const form = new FormGroup({
     *   first: new FormControl(),
     *   last: new FormControl()
     * });
     *
     * console.log(form.value);   // {first: null, last: null}
     *
     * form.setValue({first: 'Nancy', last: 'Drew'});
     * console.log(form.value);   // {first: 'Nancy', last: 'Drew'}
     *
     * ```
     * @throws When strict checks fail, such as setting the value of a control
     * that doesn't exist or if you excluding the value of a control.
     *
     * @param value The new value for the control that matches the structure of the group.
     * @param options Configuration options that determine how the control propagates changes
     * and emits events after the value changes.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
     * false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control value is updated.
     * When false, no events are emitted.
     */
    FormGroup.prototype.setValue = function (value, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this._checkAllValuesPresent(value);
        Object.keys(value).forEach(function (name) {
            _this._throwIfControlMissing(name);
            _this.controls[name].setValue(value[name], { onlySelf: true, emitEvent: options.emitEvent });
        });
        this.updateValueAndValidity(options);
    };
    /**
     * Patches the value of the `FormGroup`. It accepts an object with control
     * names as keys, and does its best to match the values to the correct controls
     * in the group.
     *
     * It accepts both super-sets and sub-sets of the group without throwing an error.
     *
     * ### Patch the value for a form group
     *
     *  ```
     *  const form = new FormGroup({
     *     first: new FormControl(),
     *     last: new FormControl()
     *  });
     *  console.log(form.value);   // {first: null, last: null}
     *
     *  form.patchValue({first: 'Nancy'});
     *  console.log(form.value);   // {first: 'Nancy', last: null}
     *
     *  ```
     *
     * @param value The object that matches the structure of the group.
     * @param options Configuration options that determine how the control propagates changes and
     * emits events after the value is patched.
     * * `onlySelf`: When true, each change only affects this control and not its parent. Default is
     * true.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control value is updated.
     * When false, no events are emitted.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     */
    FormGroup.prototype.patchValue = function (value, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        Object.keys(value).forEach(function (name) {
            if (_this.controls[name]) {
                _this.controls[name].patchValue(value[name], { onlySelf: true, emitEvent: options.emitEvent });
            }
        });
        this.updateValueAndValidity(options);
    };
    /**
     * Resets the `FormGroup`, marks all descendants are marked `pristine` and `untouched`, and
     * the value of all descendants to null.
     *
     * You reset to a specific form state by passing in a map of states
     * that matches the structure of your form, with control names as keys. The state
     * is a standalone value or a form state object with both a value and a disabled
     * status.
     *
     * @param formState Resets the control with an initial value,
     * or an object that defines the initial value and disabled state.
     *
     * @param options Configuration options that determine how the control propagates changes
     * and emits events when the group is reset.
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
     * false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is reset.
     * When false, no events are emitted.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     *
     * @usageNotes
     *
     * ### Reset the form group values
     *
     * ```ts
     * const form = new FormGroup({
     *   first: new FormControl('first name'),
     *   last: new FormControl('last name')
     * });
     *
     * console.log(form.value);  // {first: 'first name', last: 'last name'}
     *
     * form.reset({ first: 'name', last: 'last name' });
     *
     * console.log(form.value);  // {first: 'name', last: 'last name'}
     * ```
     *
     * ### Reset the form group values and disabled status
     *
     * ```
     * const form = new FormGroup({
     *   first: new FormControl('first name'),
     *   last: new FormControl('last name')
     * });
     *
     * form.reset({
     *   first: {value: 'name', disabled: true},
     *   last: 'last'
     * });
     *
     * console.log(this.form.value);  // {first: 'name', last: 'last name'}
     * console.log(this.form.get('first').status);  // 'DISABLED'
     * ```
     */
    FormGroup.prototype.reset = function (value, options) {
        if (value === void 0) { value = {}; }
        if (options === void 0) { options = {}; }
        this._forEachChild(function (control, name) {
            control.reset(value[name], { onlySelf: true, emitEvent: options.emitEvent });
        });
        this.updateValueAndValidity(options);
        this._updatePristine(options);
        this._updateTouched(options);
    };
    /**
     * The aggregate value of the `FormGroup`, including any disabled controls.
     *
     * Retrieves all values regardless of disabled status.
     * The `value` property is the best way to get the value of the group, because
     * it excludes disabled controls in the `FormGroup`.
     */
    FormGroup.prototype.getRawValue = function () {
        return this._reduceChildren({}, function (acc, control, name) {
            acc[name] = control instanceof FormControl ? control.value : control.getRawValue();
            return acc;
        });
    };
    /** @internal */
    FormGroup.prototype._syncPendingControls = function () {
        var subtreeUpdated = this._reduceChildren(false, function (updated, child) {
            return child._syncPendingControls() ? true : updated;
        });
        if (subtreeUpdated)
            this.updateValueAndValidity({ onlySelf: true });
        return subtreeUpdated;
    };
    /** @internal */
    FormGroup.prototype._throwIfControlMissing = function (name) {
        if (!Object.keys(this.controls).length) {
            throw new Error("\n        There are no form controls registered with this group yet.  If you're using ngModel,\n        you may want to check next tick (e.g. use setTimeout).\n      ");
        }
        if (!this.controls[name]) {
            throw new Error("Cannot find form control with name: " + name + ".");
        }
    };
    /** @internal */
    FormGroup.prototype._forEachChild = function (cb) {
        var _this = this;
        Object.keys(this.controls).forEach(function (k) { return cb(_this.controls[k], k); });
    };
    /** @internal */
    FormGroup.prototype._setUpControls = function () {
        var _this = this;
        this._forEachChild(function (control) {
            control.setParent(_this);
            control._registerOnCollectionChange(_this._onCollectionChange);
        });
    };
    /** @internal */
    FormGroup.prototype._updateValue = function () { this.value = this._reduceValue(); };
    /** @internal */
    FormGroup.prototype._anyControls = function (condition) {
        var _this = this;
        var res = false;
        this._forEachChild(function (control, name) {
            res = res || (_this.contains(name) && condition(control));
        });
        return res;
    };
    /** @internal */
    FormGroup.prototype._reduceValue = function () {
        var _this = this;
        return this._reduceChildren({}, function (acc, control, name) {
            if (control.enabled || _this.disabled) {
                acc[name] = control.value;
            }
            return acc;
        });
    };
    /** @internal */
    FormGroup.prototype._reduceChildren = function (initValue, fn) {
        var res = initValue;
        this._forEachChild(function (control, name) { res = fn(res, control, name); });
        return res;
    };
    /** @internal */
    FormGroup.prototype._allControlsDisabled = function () {
        var e_1, _a;
        try {
            for (var _b = tslib_1.__values(Object.keys(this.controls)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var controlName = _c.value;
                if (this.controls[controlName].enabled) {
                    return false;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return Object.keys(this.controls).length > 0 || this.disabled;
    };
    /** @internal */
    FormGroup.prototype._checkAllValuesPresent = function (value) {
        this._forEachChild(function (control, name) {
            if (value[name] === undefined) {
                throw new Error("Must supply a value for form control with name: '" + name + "'.");
            }
        });
    };
    return FormGroup;
}(AbstractControl));
export { FormGroup };
/**
 * Tracks the value and validity state of an array of `FormControl`,
 * `FormGroup` or `FormArray` instances.
 *
 * A `FormArray` aggregates the values of each child `FormControl` into an array.
 * It calculates its status by reducing the status values of its children. For example, if one of
 * the controls in a `FormArray` is invalid, the entire array becomes invalid.
 *
 * `FormArray` is one of the three fundamental building blocks used to define forms in Angular,
 * along with `FormControl` and `FormGroup`.
 *
 * @usageNotes
 *
 * ### Create an array of form controls
 *
 * ```
 * const arr = new FormArray([
 *   new FormControl('Nancy', Validators.minLength(2)),
 *   new FormControl('Drew'),
 * ]);
 *
 * console.log(arr.value);   // ['Nancy', 'Drew']
 * console.log(arr.status);  // 'VALID'
 * ```
 *
 * ### Create a form array with array-level validators
 *
 * You include array-level validators and async validators. These come in handy
 * when you want to perform validation that considers the value of more than one child
 * control.
 *
 * The two types of validators are passed in separately as the second and third arg
 * respectively, or together as part of an options object.
 *
 * ```
 * const arr = new FormArray([
 *   new FormControl('Nancy'),
 *   new FormControl('Drew')
 * ], {validators: myValidator, asyncValidators: myAsyncValidator});
 * ```
 *
  * ### Set the updateOn property for all controls in a form array
 *
 * The options object is used to set a default value for each child
 * control's `updateOn` property. If you set `updateOn` to `'blur'` at the
 * array level, all child controls default to 'blur', unless the child
 * has explicitly specified a different `updateOn` value.
 *
 * ```ts
 * const arr = new FormArray([
 *    new FormControl()
 * ], {updateOn: 'blur'});
 * ```
 *
 * ### Adding or removing controls from a form array
 *
 * To change the controls in the array, use the `push`, `insert`, or `removeAt` methods
 * in `FormArray` itself. These methods ensure the controls are properly tracked in the
 * form's hierarchy. Do not modify the array of `AbstractControl`s used to instantiate
 * the `FormArray` directly, as that result in strange and unexpected behavior such
 * as broken change detection.
 *
 *
 */
var FormArray = /** @class */ (function (_super) {
    tslib_1.__extends(FormArray, _super);
    /**
    * Creates a new `FormArray` instance.
    *
    * @param controls An array of child controls. Each child control is given an index
    * wheh it is registered.
    *
    * @param validatorOrOpts A synchronous validator function, or an array of
    * such functions, or an `AbstractControlOptions` object that contains validation functions
    * and a validation trigger.
    *
    * @param asyncValidator A single async validator or array of async validator functions
    *
    */
    function FormArray(controls, validatorOrOpts, asyncValidator) {
        var _this = _super.call(this, coerceToValidator(validatorOrOpts), coerceToAsyncValidator(asyncValidator, validatorOrOpts)) || this;
        _this.controls = controls;
        _this._initObservables();
        _this._setUpdateStrategy(validatorOrOpts);
        _this._setUpControls();
        _this.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        return _this;
    }
    /**
     * Get the `AbstractControl` at the given `index` in the array.
     *
     * @param index Index in the array to retrieve the control
     */
    FormArray.prototype.at = function (index) { return this.controls[index]; };
    /**
     * Insert a new `AbstractControl` at the end of the array.
     *
     * @param control Form control to be inserted
     */
    FormArray.prototype.push = function (control) {
        this.controls.push(control);
        this._registerControl(control);
        this.updateValueAndValidity();
        this._onCollectionChange();
    };
    /**
     * Insert a new `AbstractControl` at the given `index` in the array.
     *
     * @param index Index in the array to insert the control
     * @param control Form control to be inserted
     */
    FormArray.prototype.insert = function (index, control) {
        this.controls.splice(index, 0, control);
        this._registerControl(control);
        this.updateValueAndValidity();
    };
    /**
     * Remove the control at the given `index` in the array.
     *
     * @param index Index in the array to remove the control
     */
    FormArray.prototype.removeAt = function (index) {
        if (this.controls[index])
            this.controls[index]._registerOnCollectionChange(function () { });
        this.controls.splice(index, 1);
        this.updateValueAndValidity();
    };
    /**
     * Replace an existing control.
     *
     * @param index Index in the array to replace the control
     * @param control The `AbstractControl` control to replace the existing control
     */
    FormArray.prototype.setControl = function (index, control) {
        if (this.controls[index])
            this.controls[index]._registerOnCollectionChange(function () { });
        this.controls.splice(index, 1);
        if (control) {
            this.controls.splice(index, 0, control);
            this._registerControl(control);
        }
        this.updateValueAndValidity();
        this._onCollectionChange();
    };
    Object.defineProperty(FormArray.prototype, "length", {
        /**
         * Length of the control array.
         */
        get: function () { return this.controls.length; },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the value of the `FormArray`. It accepts an array that matches
     * the structure of the control.
     *
     * This method performs strict checks, and throws an error if you try
     * to set the value of a control that doesn't exist or if you exclude the
     * value of a control.
     *
     * ### Set the values for the controls in the form array
     *
     * ```
     * const arr = new FormArray([
     *   new FormControl(),
     *   new FormControl()
     * ]);
     * console.log(arr.value);   // [null, null]
     *
     * arr.setValue(['Nancy', 'Drew']);
     * console.log(arr.value);   // ['Nancy', 'Drew']
     * ```
     *
     * @param value Array of values for the controls
     * @param options Configure options that determine how the control propagates changes and
     * emits events after the value changes
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
     * is false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control value is updated.
     * When false, no events are emitted.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     */
    FormArray.prototype.setValue = function (value, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this._checkAllValuesPresent(value);
        value.forEach(function (newValue, index) {
            _this._throwIfControlMissing(index);
            _this.at(index).setValue(newValue, { onlySelf: true, emitEvent: options.emitEvent });
        });
        this.updateValueAndValidity(options);
    };
    /**
     * Patches the value of the `FormArray`. It accepts an array that matches the
     * structure of the control, and does its best to match the values to the correct
     * controls in the group.
     *
     * It accepts both super-sets and sub-sets of the array without throwing an error.
     *
     * ### Patch the values for controls in a form array
     *
     * ```
     * const arr = new FormArray([
     *    new FormControl(),
     *    new FormControl()
     * ]);
     * console.log(arr.value);   // [null, null]
     *
     * arr.patchValue(['Nancy']);
     * console.log(arr.value);   // ['Nancy', null]
     * ```
     *
     * @param value Array of latest values for the controls
     * @param options Configure options that determine how the control propagates changes and
     * emits events after the value changes
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
     * is false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control value is updated.
     * When false, no events are emitted.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     */
    FormArray.prototype.patchValue = function (value, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        value.forEach(function (newValue, index) {
            if (_this.at(index)) {
                _this.at(index).patchValue(newValue, { onlySelf: true, emitEvent: options.emitEvent });
            }
        });
        this.updateValueAndValidity(options);
    };
    /**
     * Resets the `FormArray` and all descendants are marked `pristine` and `untouched`, and the
     * value of all descendants to null or null maps.
     *
     * You reset to a specific form state by passing in an array of states
     * that matches the structure of the control. The state is a standalone value
     * or a form state object with both a value and a disabled status.
     *
     * ### Reset the values in a form array
     *
     * ```ts
     * const arr = new FormArray([
     *    new FormControl(),
     *    new FormControl()
     * ]);
     * arr.reset(['name', 'last name']);
     *
     * console.log(this.arr.value);  // ['name', 'last name']
     * ```
     *
     * ### Reset the values in a form array and the disabled status for the first control
     *
     * ```
     * this.arr.reset([
     *   {value: 'name', disabled: true},
     *   'last'
     * ]);
     *
     * console.log(this.arr.value);  // ['name', 'last name']
     * console.log(this.arr.get(0).status);  // 'DISABLED'
     * ```
     *
     * @param value Array of values for the controls
     * @param options Configure options that determine how the control propagates changes and
     * emits events after the value changes
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
     * is false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is reset.
     * When false, no events are emitted.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     */
    FormArray.prototype.reset = function (value, options) {
        if (value === void 0) { value = []; }
        if (options === void 0) { options = {}; }
        this._forEachChild(function (control, index) {
            control.reset(value[index], { onlySelf: true, emitEvent: options.emitEvent });
        });
        this.updateValueAndValidity(options);
        this._updatePristine(options);
        this._updateTouched(options);
    };
    /**
     * The aggregate value of the array, including any disabled controls.
     *
     * Reports all values regardless of disabled status.
     * For enabled controls only, the `value` property is the best way to get the value of the array.
     */
    FormArray.prototype.getRawValue = function () {
        return this.controls.map(function (control) {
            return control instanceof FormControl ? control.value : control.getRawValue();
        });
    };
    /** @internal */
    FormArray.prototype._syncPendingControls = function () {
        var subtreeUpdated = this.controls.reduce(function (updated, child) {
            return child._syncPendingControls() ? true : updated;
        }, false);
        if (subtreeUpdated)
            this.updateValueAndValidity({ onlySelf: true });
        return subtreeUpdated;
    };
    /** @internal */
    FormArray.prototype._throwIfControlMissing = function (index) {
        if (!this.controls.length) {
            throw new Error("\n        There are no form controls registered with this array yet.  If you're using ngModel,\n        you may want to check next tick (e.g. use setTimeout).\n      ");
        }
        if (!this.at(index)) {
            throw new Error("Cannot find form control at index " + index);
        }
    };
    /** @internal */
    FormArray.prototype._forEachChild = function (cb) {
        this.controls.forEach(function (control, index) { cb(control, index); });
    };
    /** @internal */
    FormArray.prototype._updateValue = function () {
        var _this = this;
        this.value =
            this.controls.filter(function (control) { return control.enabled || _this.disabled; })
                .map(function (control) { return control.value; });
    };
    /** @internal */
    FormArray.prototype._anyControls = function (condition) {
        return this.controls.some(function (control) { return control.enabled && condition(control); });
    };
    /** @internal */
    FormArray.prototype._setUpControls = function () {
        var _this = this;
        this._forEachChild(function (control) { return _this._registerControl(control); });
    };
    /** @internal */
    FormArray.prototype._checkAllValuesPresent = function (value) {
        this._forEachChild(function (control, i) {
            if (value[i] === undefined) {
                throw new Error("Must supply a value for form control at index: " + i + ".");
            }
        });
    };
    /** @internal */
    FormArray.prototype._allControlsDisabled = function () {
        var e_2, _a;
        try {
            for (var _b = tslib_1.__values(this.controls), _c = _b.next(); !_c.done; _c = _b.next()) {
                var control = _c.value;
                if (control.enabled)
                    return false;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return this.controls.length > 0 || this.disabled;
    };
    FormArray.prototype._registerControl = function (control) {
        control.setParent(this);
        control._registerOnCollectionChange(this._onCollectionChange);
    };
    return FormArray;
}(AbstractControl));
export { FormArray };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFDLHNCQUFzQixFQUFFLGlCQUFpQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFFOUUsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUUxQzs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQztBQUU3Qjs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLElBQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQztBQUVqQzs7Ozs7O0dBTUc7QUFDSCxNQUFNLENBQUMsSUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBRWpDOzs7Ozs7R0FNRztBQUNILE1BQU0sQ0FBQyxJQUFNLFFBQVEsR0FBRyxVQUFVLENBQUM7QUFFbkMsU0FBUyxLQUFLLENBQUMsT0FBd0IsRUFBRSxJQUFrQyxFQUFFLFNBQWlCO0lBQzVGLElBQUksSUFBSSxJQUFJLElBQUk7UUFBRSxPQUFPLElBQUksQ0FBQztJQUU5QixJQUFJLENBQUMsQ0FBQyxJQUFJLFlBQVksS0FBSyxDQUFDLEVBQUU7UUFDNUIsSUFBSSxHQUFZLElBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDeEM7SUFDRCxJQUFJLElBQUksWUFBWSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztRQUFFLE9BQU8sSUFBSSxDQUFDO0lBRTlELE9BQThCLElBQUssQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFrQixFQUFFLElBQUk7UUFDbEUsSUFBSSxDQUFDLFlBQVksU0FBUyxFQUFFO1lBQzFCLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztTQUM1RTtRQUVELElBQUksQ0FBQyxZQUFZLFNBQVMsRUFBRTtZQUMxQixPQUFPLENBQUMsQ0FBQyxFQUFFLENBQVMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDO1NBQ25DO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDZCxDQUFDO0FBRUQsU0FBUyxpQkFBaUIsQ0FDdEIsZUFBNkU7SUFFL0UsSUFBTSxTQUFTLEdBQ1gsQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFFLGVBQTBDLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDeEQsZUFBZSxDQUM1QixDQUFDO0lBRXpCLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUM7QUFDckYsQ0FBQztBQUVELFNBQVMsc0JBQXNCLENBQzNCLGNBQTZELEVBQUUsZUFDZDtJQUNuRCxJQUFNLGtCQUFrQixHQUNwQixDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUUsZUFBMEMsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUM3RCxjQUFjLENBQ3hCLENBQUM7SUFFNUIsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztRQUM1QyxrQkFBa0IsSUFBSSxJQUFJLENBQUM7QUFDeEUsQ0FBQztBQXlCRCxTQUFTLFlBQVksQ0FDakIsZUFBNkU7SUFDL0UsT0FBTyxlQUFlLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUM7UUFDN0QsT0FBTyxlQUFlLEtBQUssUUFBUSxDQUFDO0FBQzFDLENBQUM7QUFHRDs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSDtJQStCRTs7Ozs7O09BTUc7SUFDSCx5QkFBbUIsU0FBMkIsRUFBUyxjQUFxQztRQUF6RSxjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUFTLG1CQUFjLEdBQWQsY0FBYyxDQUF1QjtRQTdCNUYsZ0JBQWdCO1FBQ2hCLHdCQUFtQixHQUFHLGNBQU8sQ0FBQyxDQUFDO1FBK0cvQjs7Ozs7O1dBTUc7UUFDYSxhQUFRLEdBQVksSUFBSSxDQUFDO1FBV3pDOzs7OztXQUtHO1FBQ2EsWUFBTyxHQUFZLEtBQUssQ0FBQztRQTRkekMsZ0JBQWdCO1FBQ2hCLHNCQUFpQixHQUFlLEVBQUUsQ0FBQztJQXhrQjRELENBQUM7SUFLaEcsc0JBQUksbUNBQU07UUFIVjs7V0FFRzthQUNILGNBQW9DLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBeUIxRCxzQkFBSSxrQ0FBSztRQVJUOzs7Ozs7O1dBT0c7YUFDSCxjQUF1QixPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFVdEQsc0JBQUksb0NBQU87UUFSWDs7Ozs7OztXQU9HO2FBQ0gsY0FBeUIsT0FBTyxJQUFJLENBQUMsTUFBTSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBVTFELHNCQUFJLG9DQUFPO1FBUlg7Ozs7Ozs7V0FPRzthQUNILGNBQXlCLE9BQU8sSUFBSSxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQWF6RCxzQkFBSSxxQ0FBUTtRQVhaOzs7Ozs7Ozs7O1dBVUc7YUFDSCxjQUEwQixPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFXNUQsc0JBQUksb0NBQU87UUFUWDs7Ozs7Ozs7V0FRRzthQUNILGNBQXlCLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQXlCM0Qsc0JBQUksa0NBQUs7UUFQVDs7Ozs7O1dBTUc7YUFDSCxjQUF1QixPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBZ0IvQyxzQkFBSSxzQ0FBUztRQU5iOzs7OztXQUtHO2FBQ0gsY0FBMkIsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQXNCbEQsc0JBQUkscUNBQVE7UUFOWjs7Ozs7V0FLRzthQUNIO1lBQ0UsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzRixDQUFDOzs7T0FBQTtJQUVEOzs7T0FHRztJQUNILHVDQUFhLEdBQWIsVUFBYyxZQUE0QztRQUN4RCxJQUFJLENBQUMsU0FBUyxHQUFHLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRDs7O09BR0c7SUFDSCw0Q0FBa0IsR0FBbEIsVUFBbUIsWUFBc0Q7UUFDdkUsSUFBSSxDQUFDLGNBQWMsR0FBRyxzQkFBc0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQ7O09BRUc7SUFDSCx5Q0FBZSxHQUFmLGNBQTBCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUVsRDs7T0FFRztJQUNILDhDQUFvQixHQUFwQixjQUErQixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFNUQ7Ozs7Ozs7O09BUUc7SUFDSCx1Q0FBYSxHQUFiLFVBQWMsSUFBK0I7UUFBL0IscUJBQUEsRUFBQSxTQUErQjtRQUMxQyxJQUEwQixDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFFM0MsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNsQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNsQztJQUNILENBQUM7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ0gseUNBQWUsR0FBZixVQUFnQixJQUErQjtRQUEvQixxQkFBQSxFQUFBLFNBQStCO1FBQzVDLElBQTBCLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUM1QyxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztRQUU3QixJQUFJLENBQUMsYUFBYSxDQUNkLFVBQUMsT0FBd0IsSUFBTyxPQUFPLENBQUMsZUFBZSxDQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVsRixJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ25DO0lBQ0gsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0gscUNBQVcsR0FBWCxVQUFZLElBQStCO1FBQS9CLHFCQUFBLEVBQUEsU0FBK0I7UUFDeEMsSUFBMkIsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBRTlDLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDaEM7SUFDSCxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7O09BV0c7SUFDSCx3Q0FBYyxHQUFkLFVBQWUsSUFBK0I7UUFBL0IscUJBQUEsRUFBQSxTQUErQjtRQUMzQyxJQUEyQixDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDN0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFFM0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFDLE9BQXdCLElBQU8sT0FBTyxDQUFDLGNBQWMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFaEcsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNsQyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNwQztJQUNILENBQUM7SUFFRDs7Ozs7Ozs7Ozs7OztPQWFHO0lBQ0gsdUNBQWEsR0FBYixVQUFjLElBQW9EO1FBQXBELHFCQUFBLEVBQUEsU0FBb0Q7UUFDL0QsSUFBd0IsQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDO1FBRTNDLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxLQUFLLEVBQUU7WUFDM0IsSUFBSSxDQUFDLGFBQW1DLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM3RDtRQUVELElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbEM7SUFDSCxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7O09BY0c7SUFDSCxpQ0FBTyxHQUFQLFVBQVEsSUFBb0Q7UUFBcEQscUJBQUEsRUFBQSxTQUFvRDtRQUN6RCxJQUF3QixDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7UUFDM0MsSUFBeUMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ3pELElBQUksQ0FBQyxhQUFhLENBQ2QsVUFBQyxPQUF3QixJQUFPLE9BQU8sQ0FBQyxPQUFPLHNCQUFLLElBQUksSUFBRSxRQUFRLEVBQUUsSUFBSSxJQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFcEIsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLEtBQUssRUFBRTtZQUMzQixJQUFJLENBQUMsWUFBa0MsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3pELElBQUksQ0FBQyxhQUFzQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDaEU7UUFFRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVEsSUFBSyxPQUFBLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBZCxDQUFjLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7OztPQWVHO0lBQ0gsZ0NBQU0sR0FBTixVQUFPLElBQW9EO1FBQXBELHFCQUFBLEVBQUEsU0FBb0Q7UUFDeEQsSUFBd0IsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxhQUFhLENBQ2QsVUFBQyxPQUF3QixJQUFPLE9BQU8sQ0FBQyxNQUFNLHNCQUFLLElBQUksSUFBRSxRQUFRLEVBQUUsSUFBSSxJQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRixJQUFJLENBQUMsc0JBQXNCLENBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQztRQUV6RSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVEsSUFBSyxPQUFBLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBZixDQUFlLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRU8sMENBQWdCLEdBQXhCLFVBQXlCLElBQStDO1FBQ3RFLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMxQyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDL0I7SUFDSCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxtQ0FBUyxHQUFULFVBQVUsTUFBMkIsSUFBVSxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFpQnZFOzs7Ozs7Ozs7Ozs7O09BYUc7SUFDSCxnREFBc0IsR0FBdEIsVUFBdUIsSUFBb0Q7UUFBcEQscUJBQUEsRUFBQSxTQUFvRDtRQUN6RSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFcEIsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLElBQUksQ0FBQywyQkFBMkIsRUFBRSxDQUFDO1lBQ2xDLElBQXlDLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN4RSxJQUF3QixDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUUzRCxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssT0FBTyxFQUFFO2dCQUNwRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ3pDO1NBQ0Y7UUFFRCxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssS0FBSyxFQUFFO1lBQzNCLElBQUksQ0FBQyxZQUFrQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDekQsSUFBSSxDQUFDLGFBQXNDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNoRTtRQUVELElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMzQztJQUNILENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsNkNBQW1CLEdBQW5CLFVBQW9CLElBQStDO1FBQS9DLHFCQUFBLEVBQUEsU0FBK0IsU0FBUyxFQUFFLElBQUksRUFBQztRQUNqRSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQUMsSUFBcUIsSUFBSyxPQUFBLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsRUFBOUIsQ0FBOEIsQ0FBQyxDQUFDO1FBQzlFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUMsQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFFTywyQ0FBaUIsR0FBekI7UUFDRyxJQUF3QixDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDcEYsQ0FBQztJQUVPLHVDQUFhLEdBQXJCO1FBQ0UsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDdEQsQ0FBQztJQUVPLDRDQUFrQixHQUExQixVQUEyQixTQUFtQjtRQUE5QyxpQkFPQztRQU5DLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUN0QixJQUF3QixDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUM7WUFDM0MsSUFBTSxHQUFHLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUMsNEJBQTRCO2dCQUM3QixHQUFHLENBQUMsU0FBUyxDQUFDLFVBQUMsTUFBK0IsSUFBSyxPQUFBLEtBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLEVBQUMsU0FBUyxXQUFBLEVBQUMsQ0FBQyxFQUFuQyxDQUFtQyxDQUFDLENBQUM7U0FDN0Y7SUFDSCxDQUFDO0lBRU8scURBQTJCLEdBQW5DO1FBQ0UsSUFBSSxJQUFJLENBQUMsNEJBQTRCLEVBQUU7WUFDckMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ2pEO0lBQ0gsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQW9CRztJQUNILG1DQUFTLEdBQVQsVUFBVSxNQUE2QixFQUFFLElBQWdDO1FBQWhDLHFCQUFBLEVBQUEsU0FBZ0M7UUFDdEUsSUFBeUMsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQzNELElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxLQUFLLEtBQUssQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7O09BZUc7SUFDSCw2QkFBRyxHQUFILFVBQUksSUFBaUMsSUFBMEIsT0FBTyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFL0Y7Ozs7Ozs7OztPQVNHO0lBQ0gsa0NBQVEsR0FBUixVQUFTLFNBQWlCLEVBQUUsSUFBZTtRQUN6QyxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUM3QyxPQUFPLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDdEUsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxrQ0FBUSxHQUFSLFVBQVMsU0FBaUIsRUFBRSxJQUFlLElBQWEsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBS2xHLHNCQUFJLGlDQUFJO1FBSFI7O1dBRUc7YUFDSDtZQUNFLElBQUksQ0FBQyxHQUFvQixJQUFJLENBQUM7WUFFOUIsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFO2dCQUNoQixDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQzthQUNmO1lBRUQsT0FBTyxDQUFDLENBQUM7UUFDWCxDQUFDOzs7T0FBQTtJQUVELGdCQUFnQjtJQUNoQiwrQ0FBcUIsR0FBckIsVUFBc0IsU0FBa0I7UUFDckMsSUFBd0IsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFFM0QsSUFBSSxTQUFTLEVBQUU7WUFDWixJQUFJLENBQUMsYUFBc0MsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ2hFO1FBRUQsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDL0M7SUFDSCxDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLDBDQUFnQixHQUFoQjtRQUNHLElBQXVDLENBQUMsWUFBWSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDMUUsSUFBd0MsQ0FBQyxhQUFhLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQUMvRSxDQUFDO0lBR08sMENBQWdCLEdBQXhCO1FBQ0UsSUFBSSxJQUFJLENBQUMsb0JBQW9CLEVBQUU7WUFBRSxPQUFPLFFBQVEsQ0FBQztRQUNqRCxJQUFJLElBQUksQ0FBQyxNQUFNO1lBQUUsT0FBTyxPQUFPLENBQUM7UUFDaEMsSUFBSSxJQUFJLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDO1lBQUUsT0FBTyxPQUFPLENBQUM7UUFDekQsSUFBSSxJQUFJLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDO1lBQUUsT0FBTyxPQUFPLENBQUM7UUFDekQsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBaUJELGdCQUFnQjtJQUNoQixnREFBc0IsR0FBdEIsVUFBdUIsTUFBYztRQUNuQyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBQyxPQUF3QixJQUFLLE9BQUEsT0FBTyxDQUFDLE1BQU0sS0FBSyxNQUFNLEVBQXpCLENBQXlCLENBQUMsQ0FBQztJQUNwRixDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLDJDQUFpQixHQUFqQjtRQUNFLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFDLE9BQXdCLElBQUssT0FBQSxPQUFPLENBQUMsS0FBSyxFQUFiLENBQWEsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsNkNBQW1CLEdBQW5CO1FBQ0UsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQUMsT0FBd0IsSUFBSyxPQUFBLE9BQU8sQ0FBQyxPQUFPLEVBQWYsQ0FBZSxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVELGdCQUFnQjtJQUNoQix5Q0FBZSxHQUFmLFVBQWdCLElBQStCO1FBQS9CLHFCQUFBLEVBQUEsU0FBK0I7UUFDNUMsSUFBMkIsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUVsRSxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3BDO0lBQ0gsQ0FBQztJQUVELGdCQUFnQjtJQUNoQix3Q0FBYyxHQUFkLFVBQWUsSUFBK0I7UUFBL0IscUJBQUEsRUFBQSxTQUErQjtRQUMzQyxJQUEwQixDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUVqRSxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ25DO0lBQ0gsQ0FBQztJQUtELGdCQUFnQjtJQUNoQix1Q0FBYSxHQUFiLFVBQWMsU0FBYztRQUMxQixPQUFPLE9BQU8sU0FBUyxLQUFLLFFBQVEsSUFBSSxTQUFTLEtBQUssSUFBSTtZQUN0RCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksT0FBTyxJQUFJLFNBQVMsSUFBSSxVQUFVLElBQUksU0FBUyxDQUFDO0lBQzdGLENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIscURBQTJCLEdBQTNCLFVBQTRCLEVBQWMsSUFBVSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUVwRixnQkFBZ0I7SUFDaEIsNENBQWtCLEdBQWxCLFVBQW1CLElBQTREO1FBQzdFLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFLLElBQStCLENBQUMsUUFBUSxJQUFJLElBQUksRUFBRTtZQUMzRSxJQUFJLENBQUMsU0FBUyxHQUFJLElBQStCLENBQUMsUUFBVSxDQUFDO1NBQzlEO0lBQ0gsQ0FBQztJQUNILHNCQUFDO0FBQUQsQ0FBQyxBQS9uQkQsSUErbkJDOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBOEZFO0FBQ0Y7SUFBaUMsdUNBQWU7SUFVOUM7Ozs7Ozs7Ozs7OztNQVlFO0lBQ0YscUJBQ0ksU0FBcUIsRUFDckIsZUFBdUUsRUFDdkUsY0FBeUQ7UUFGekQsMEJBQUEsRUFBQSxnQkFBcUI7UUFEekIsWUFJRSxrQkFDSSxpQkFBaUIsQ0FBQyxlQUFlLENBQUMsRUFDbEMsc0JBQXNCLENBQUMsY0FBYyxFQUFFLGVBQWUsQ0FBQyxDQUFDLFNBSzdEO1FBakNELGdCQUFnQjtRQUNoQixlQUFTLEdBQWUsRUFBRSxDQUFDO1FBNEJ6QixLQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hDLEtBQUksQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN6QyxLQUFJLENBQUMsc0JBQXNCLENBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1FBQ2hFLEtBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDOztJQUMxQixDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FzQkc7SUFDSCw4QkFBUSxHQUFSLFVBQVMsS0FBVSxFQUFFLE9BS2Y7UUFMTixpQkFZQztRQVpvQix3QkFBQSxFQUFBLFlBS2Y7UUFDSCxJQUFvQixDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztRQUN6RCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxxQkFBcUIsS0FBSyxLQUFLLEVBQUU7WUFDcEUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQ2xCLFVBQUMsUUFBUSxJQUFLLE9BQUEsUUFBUSxDQUFDLEtBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLHFCQUFxQixLQUFLLEtBQUssQ0FBQyxFQUE3RCxDQUE2RCxDQUFDLENBQUM7U0FDbEY7UUFDRCxJQUFJLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0gsZ0NBQVUsR0FBVixVQUFXLEtBQVUsRUFBRSxPQUtqQjtRQUxpQix3QkFBQSxFQUFBLFlBS2pCO1FBQ0osSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7OztPQWlCRztJQUNILDJCQUFLLEdBQUwsVUFBTSxTQUFxQixFQUFFLE9BQXVEO1FBQTlFLDBCQUFBLEVBQUEsZ0JBQXFCO1FBQUUsd0JBQUEsRUFBQSxZQUF1RDtRQUNsRixJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7SUFDOUIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsa0NBQVksR0FBWixjQUFnQixDQUFDO0lBRWpCOztPQUVHO0lBQ0gsa0NBQVksR0FBWixVQUFhLFNBQW1CLElBQWEsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBRTVEOztPQUVHO0lBQ0gsMENBQW9CLEdBQXBCLGNBQWtDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFFekQ7Ozs7T0FJRztJQUNILHNDQUFnQixHQUFoQixVQUFpQixFQUFZLElBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWpFOztPQUVHO0lBQ0gscUNBQWUsR0FBZjtRQUNFLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLG1CQUFtQixHQUFHLGNBQU8sQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsOENBQXdCLEdBQXhCLFVBQXlCLEVBQWlDO1FBQ3hELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsbUNBQWEsR0FBYixVQUFjLEVBQVksSUFBUyxDQUFDO0lBRXBDLGdCQUFnQjtJQUNoQiwwQ0FBb0IsR0FBcEI7UUFDRSxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssUUFBUSxFQUFFO1lBQzlCLElBQUksSUFBSSxDQUFDLGFBQWE7Z0JBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQzNDLElBQUksSUFBSSxDQUFDLGVBQWU7Z0JBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQy9DLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtnQkFDdkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxxQkFBcUIsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO2dCQUNsRixPQUFPLElBQUksQ0FBQzthQUNiO1NBQ0Y7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFTyxxQ0FBZSxHQUF2QixVQUF3QixTQUFjO1FBQ3BDLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUNoQyxJQUFvQixDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUM7WUFDbkUsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7U0FDdEU7YUFBTTtZQUNKLElBQW9CLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFDO1NBQzlEO0lBQ0gsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FBQyxBQXhMRCxDQUFpQyxlQUFlLEdBd0wvQzs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBcUVHO0FBQ0g7SUFBK0IscUNBQWU7SUFDNUM7Ozs7Ozs7Ozs7OztNQVlFO0lBQ0YsbUJBQ1csUUFBMEMsRUFDakQsZUFBdUUsRUFDdkUsY0FBeUQ7UUFIN0QsWUFJRSxrQkFDSSxpQkFBaUIsQ0FBQyxlQUFlLENBQUMsRUFDbEMsc0JBQXNCLENBQUMsY0FBYyxFQUFFLGVBQWUsQ0FBQyxDQUFDLFNBSzdEO1FBVlUsY0FBUSxHQUFSLFFBQVEsQ0FBa0M7UUFNbkQsS0FBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDeEIsS0FBSSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3pDLEtBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN0QixLQUFJLENBQUMsc0JBQXNCLENBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDOztJQUNsRSxDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSCxtQ0FBZSxHQUFmLFVBQWdCLElBQVksRUFBRSxPQUF3QjtRQUNwRCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1lBQUUsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDO1FBQzlCLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEIsT0FBTyxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQzlELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsOEJBQVUsR0FBVixVQUFXLElBQVksRUFBRSxPQUF3QjtRQUMvQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILGlDQUFhLEdBQWIsVUFBYyxJQUFZO1FBQ3hCLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLDJCQUEyQixDQUFDLGNBQU8sQ0FBQyxDQUFDLENBQUM7UUFDbkYsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCw4QkFBVSxHQUFWLFVBQVcsSUFBWSxFQUFFLE9BQXdCO1FBQy9DLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLDJCQUEyQixDQUFDLGNBQU8sQ0FBQyxDQUFDLENBQUM7UUFDbkYsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM3QixJQUFJLE9BQU87WUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0gsNEJBQVEsR0FBUixVQUFTLFdBQW1CO1FBQzFCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUM7SUFDekYsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FpQ0c7SUFDSCw0QkFBUSxHQUFSLFVBQVMsS0FBMkIsRUFBRSxPQUF1RDtRQUE3RixpQkFRQztRQVJxQyx3QkFBQSxFQUFBLFlBQXVEO1FBRTNGLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUk7WUFDN0IsS0FBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xDLEtBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQUMsQ0FBQyxDQUFDO1FBQzVGLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FnQ0c7SUFDSCw4QkFBVSxHQUFWLFVBQVcsS0FBMkIsRUFBRSxPQUF1RDtRQUEvRixpQkFRQztRQVJ1Qyx3QkFBQSxFQUFBLFlBQXVEO1FBRTdGLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTtZQUM3QixJQUFJLEtBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3ZCLEtBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQUMsQ0FBQyxDQUFDO2FBQzdGO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXdERztJQUNILHlCQUFLLEdBQUwsVUFBTSxLQUFlLEVBQUUsT0FBdUQ7UUFBeEUsc0JBQUEsRUFBQSxVQUFlO1FBQUUsd0JBQUEsRUFBQSxZQUF1RDtRQUM1RSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQUMsT0FBd0IsRUFBRSxJQUFZO1lBQ3hELE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFBQyxDQUFDLENBQUM7UUFDN0UsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCwrQkFBVyxHQUFYO1FBQ0UsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUN2QixFQUFFLEVBQUUsVUFBQyxHQUFtQyxFQUFFLE9BQXdCLEVBQUUsSUFBWTtZQUM5RSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxZQUFZLFdBQVcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQU8sT0FBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQzFGLE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQyxDQUFDLENBQUM7SUFDVCxDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLHdDQUFvQixHQUFwQjtRQUNFLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLFVBQUMsT0FBZ0IsRUFBRSxLQUFzQjtZQUN4RixPQUFPLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUN2RCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksY0FBYztZQUFFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBQ2xFLE9BQU8sY0FBYyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsMENBQXNCLEdBQXRCLFVBQXVCLElBQVk7UUFDakMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRTtZQUN0QyxNQUFNLElBQUksS0FBSyxDQUFDLHdLQUdmLENBQUMsQ0FBQztTQUNKO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx5Q0FBdUMsSUFBSSxNQUFHLENBQUMsQ0FBQztTQUNqRTtJQUNILENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsaUNBQWEsR0FBYixVQUFjLEVBQStCO1FBQTdDLGlCQUVDO1FBREMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsRUFBRSxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQXZCLENBQXVCLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLGtDQUFjLEdBQWQ7UUFBQSxpQkFLQztRQUpDLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBQyxPQUF3QjtZQUMxQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUksQ0FBQyxDQUFDO1lBQ3hCLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxLQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUNoRSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsZ0NBQVksR0FBWixjQUF3QixJQUFvQixDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRTNFLGdCQUFnQjtJQUNoQixnQ0FBWSxHQUFaLFVBQWEsU0FBbUI7UUFBaEMsaUJBTUM7UUFMQyxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUM7UUFDaEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFDLE9BQXdCLEVBQUUsSUFBWTtZQUN4RCxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUMzRCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUVELGdCQUFnQjtJQUNoQixnQ0FBWSxHQUFaO1FBQUEsaUJBUUM7UUFQQyxPQUFPLElBQUksQ0FBQyxlQUFlLENBQ3ZCLEVBQUUsRUFBRSxVQUFDLEdBQW1DLEVBQUUsT0FBd0IsRUFBRSxJQUFZO1lBQzlFLElBQUksT0FBTyxDQUFDLE9BQU8sSUFBSSxLQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNwQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQzthQUMzQjtZQUNELE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQyxDQUFDLENBQUM7SUFDVCxDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLG1DQUFlLEdBQWYsVUFBZ0IsU0FBYyxFQUFFLEVBQVk7UUFDMUMsSUFBSSxHQUFHLEdBQUcsU0FBUyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxhQUFhLENBQ2QsVUFBQyxPQUF3QixFQUFFLElBQVksSUFBTyxHQUFHLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRixPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsd0NBQW9CLEdBQXBCOzs7WUFDRSxLQUEwQixJQUFBLEtBQUEsaUJBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUEsZ0JBQUEsNEJBQUU7Z0JBQWpELElBQU0sV0FBVyxXQUFBO2dCQUNwQixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxFQUFFO29CQUN0QyxPQUFPLEtBQUssQ0FBQztpQkFDZDthQUNGOzs7Ozs7Ozs7UUFDRCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUNoRSxDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLDBDQUFzQixHQUF0QixVQUF1QixLQUFVO1FBQy9CLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBQyxPQUF3QixFQUFFLElBQVk7WUFDeEQsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssU0FBUyxFQUFFO2dCQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLHNEQUFvRCxJQUFJLE9BQUksQ0FBQyxDQUFDO2FBQy9FO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0gsZ0JBQUM7QUFBRCxDQUFDLEFBOVZELENBQStCLGVBQWUsR0E4VjdDOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0ErREc7QUFDSDtJQUErQixxQ0FBZTtJQUM1Qzs7Ozs7Ozs7Ozs7O01BWUU7SUFDRixtQkFDVyxRQUEyQixFQUNsQyxlQUF1RSxFQUN2RSxjQUF5RDtRQUg3RCxZQUlFLGtCQUNJLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxFQUNsQyxzQkFBc0IsQ0FBQyxjQUFjLEVBQUUsZUFBZSxDQUFDLENBQUMsU0FLN0Q7UUFWVSxjQUFRLEdBQVIsUUFBUSxDQUFtQjtRQU1wQyxLQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN4QixLQUFJLENBQUMsa0JBQWtCLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDekMsS0FBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLEtBQUksQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7O0lBQ2xFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsc0JBQUUsR0FBRixVQUFHLEtBQWEsSUFBcUIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVuRTs7OztPQUlHO0lBQ0gsd0JBQUksR0FBSixVQUFLLE9BQXdCO1FBQzNCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCwwQkFBTSxHQUFOLFVBQU8sS0FBYSxFQUFFLE9BQXdCO1FBQzVDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFeEMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0lBQ2hDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsNEJBQVEsR0FBUixVQUFTLEtBQWE7UUFDcEIsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztZQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsMkJBQTJCLENBQUMsY0FBTyxDQUFDLENBQUMsQ0FBQztRQUNyRixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7SUFDaEMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsOEJBQVUsR0FBVixVQUFXLEtBQWEsRUFBRSxPQUF3QjtRQUNoRCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO1lBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQywyQkFBMkIsQ0FBQyxjQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3JGLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUUvQixJQUFJLE9BQU8sRUFBRTtZQUNYLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2hDO1FBRUQsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUtELHNCQUFJLDZCQUFNO1FBSFY7O1dBRUc7YUFDSCxjQUF1QixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFckQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQWlDRztJQUNILDRCQUFRLEdBQVIsVUFBUyxLQUFZLEVBQUUsT0FBdUQ7UUFBOUUsaUJBT0M7UUFQc0Isd0JBQUEsRUFBQSxZQUF1RDtRQUM1RSxJQUFJLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQWEsRUFBRSxLQUFhO1lBQ3pDLEtBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuQyxLQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQztRQUNwRixDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BZ0NHO0lBQ0gsOEJBQVUsR0FBVixVQUFXLEtBQVksRUFBRSxPQUF1RDtRQUFoRixpQkFPQztRQVB3Qix3QkFBQSxFQUFBLFlBQXVEO1FBQzlFLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFhLEVBQUUsS0FBYTtZQUN6QyxJQUFJLEtBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ2xCLEtBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQUMsQ0FBQyxDQUFDO2FBQ3JGO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQTRDRztJQUNILHlCQUFLLEdBQUwsVUFBTSxLQUFlLEVBQUUsT0FBdUQ7UUFBeEUsc0JBQUEsRUFBQSxVQUFlO1FBQUUsd0JBQUEsRUFBQSxZQUF1RDtRQUM1RSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQUMsT0FBd0IsRUFBRSxLQUFhO1lBQ3pELE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFBQyxDQUFDLENBQUM7UUFDOUUsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILCtCQUFXLEdBQVg7UUFDRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUMsT0FBd0I7WUFDaEQsT0FBTyxPQUFPLFlBQVksV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBTyxPQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdkYsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLHdDQUFvQixHQUFwQjtRQUNFLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQUMsT0FBZ0IsRUFBRSxLQUFzQjtZQUNqRixPQUFPLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUN2RCxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDVixJQUFJLGNBQWM7WUFBRSxJQUFJLENBQUMsc0JBQXNCLENBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUNsRSxPQUFPLGNBQWMsQ0FBQztJQUN4QixDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLDBDQUFzQixHQUF0QixVQUF1QixLQUFhO1FBQ2xDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTtZQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLHdLQUdmLENBQUMsQ0FBQztTQUNKO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDbkIsTUFBTSxJQUFJLEtBQUssQ0FBQyx1Q0FBcUMsS0FBTyxDQUFDLENBQUM7U0FDL0Q7SUFDSCxDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLGlDQUFhLEdBQWIsVUFBYyxFQUFZO1FBQ3hCLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBd0IsRUFBRSxLQUFhLElBQU8sRUFBRSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlGLENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsZ0NBQVksR0FBWjtRQUFBLGlCQUlDO1FBSEUsSUFBb0IsQ0FBQyxLQUFLO1lBQ3ZCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQUMsT0FBTyxJQUFLLE9BQUEsT0FBTyxDQUFDLE9BQU8sSUFBSSxLQUFJLENBQUMsUUFBUSxFQUFoQyxDQUFnQyxDQUFDO2lCQUM5RCxHQUFHLENBQUMsVUFBQyxPQUFPLElBQUssT0FBQSxPQUFPLENBQUMsS0FBSyxFQUFiLENBQWEsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsZ0NBQVksR0FBWixVQUFhLFNBQW1CO1FBQzlCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBQyxPQUF3QixJQUFLLE9BQUEsT0FBTyxDQUFDLE9BQU8sSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQXJDLENBQXFDLENBQUMsQ0FBQztJQUNqRyxDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLGtDQUFjLEdBQWQ7UUFBQSxpQkFFQztRQURDLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBQyxPQUF3QixJQUFLLE9BQUEsS0FBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxFQUE5QixDQUE4QixDQUFDLENBQUM7SUFDbkYsQ0FBQztJQUVELGdCQUFnQjtJQUNoQiwwQ0FBc0IsR0FBdEIsVUFBdUIsS0FBVTtRQUMvQixJQUFJLENBQUMsYUFBYSxDQUFDLFVBQUMsT0FBd0IsRUFBRSxDQUFTO1lBQ3JELElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsRUFBRTtnQkFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxvREFBa0QsQ0FBQyxNQUFHLENBQUMsQ0FBQzthQUN6RTtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGdCQUFnQjtJQUNoQix3Q0FBb0IsR0FBcEI7OztZQUNFLEtBQXNCLElBQUEsS0FBQSxpQkFBQSxJQUFJLENBQUMsUUFBUSxDQUFBLGdCQUFBLDRCQUFFO2dCQUFoQyxJQUFNLE9BQU8sV0FBQTtnQkFDaEIsSUFBSSxPQUFPLENBQUMsT0FBTztvQkFBRSxPQUFPLEtBQUssQ0FBQzthQUNuQzs7Ozs7Ozs7O1FBQ0QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUNuRCxDQUFDO0lBRU8sb0NBQWdCLEdBQXhCLFVBQXlCLE9BQXdCO1FBQy9DLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEIsT0FBTyxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFDSCxnQkFBQztBQUFELENBQUMsQUF0VEQsQ0FBK0IsZUFBZSxHQXNUN0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RXZlbnRFbWl0dGVyfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2NvbXBvc2VBc3luY1ZhbGlkYXRvcnMsIGNvbXBvc2VWYWxpZGF0b3JzfSBmcm9tICcuL2RpcmVjdGl2ZXMvc2hhcmVkJztcbmltcG9ydCB7QXN5bmNWYWxpZGF0b3JGbiwgVmFsaWRhdGlvbkVycm9ycywgVmFsaWRhdG9yRm59IGZyb20gJy4vZGlyZWN0aXZlcy92YWxpZGF0b3JzJztcbmltcG9ydCB7dG9PYnNlcnZhYmxlfSBmcm9tICcuL3ZhbGlkYXRvcnMnO1xuXG4vKipcbiAqIFJlcG9ydHMgdGhhdCBhIEZvcm1Db250cm9sIGlzIHZhbGlkLCBtZWFuaW5nIHRoYXQgbm8gZXJyb3JzIGV4aXN0IGluIHRoZSBpbnB1dCB2YWx1ZS5cbiAqXG4gKiBAc2VlIGBzdGF0dXNgXG4gKi9cbmV4cG9ydCBjb25zdCBWQUxJRCA9ICdWQUxJRCc7XG5cbi8qKlxuICogUmVwb3J0cyB0aGF0IGEgRm9ybUNvbnRyb2wgaXMgaW52YWxpZCwgbWVhbmluZyB0aGF0IGFuIGVycm9yIGV4aXN0cyBpbiB0aGUgaW5wdXQgdmFsdWUuXG4gKlxuICogQHNlZSBgc3RhdHVzYFxuICovXG5leHBvcnQgY29uc3QgSU5WQUxJRCA9ICdJTlZBTElEJztcblxuLyoqXG4gKiBSZXBvcnRzIHRoYXQgYSBGb3JtQ29udHJvbCBpcyBwZW5kaW5nLCBtZWFuaW5nIHRoYXQgdGhhdCBhc3luYyB2YWxpZGF0aW9uIGlzIG9jY3VycmluZyBhbmRcbiAqIGVycm9ycyBhcmUgbm90IHlldCBhdmFpbGFibGUgZm9yIHRoZSBpbnB1dCB2YWx1ZS5cbiAqXG4gKiBAc2VlIGBtYXJrQXNQZW5kaW5nYFxuICogQHNlZSBgc3RhdHVzYFxuICovXG5leHBvcnQgY29uc3QgUEVORElORyA9ICdQRU5ESU5HJztcblxuLyoqXG4gKiBSZXBvcnRzIHRoYXQgYSBGb3JtQ29udHJvbCBpcyBkaXNhYmxlZCwgbWVhbmluZyB0aGF0IHRoZSBjb250cm9sIGlzIGV4ZW1wdCBmcm9tIGFuY2VzdG9yXG4gKiBjYWxjdWxhdGlvbnMgb2YgdmFsaWRpdHkgb3IgdmFsdWUuXG4gKlxuICogQHNlZSBgbWFya0FzRGlzYWJsZWRgXG4gKiBAc2VlIGBzdGF0dXNgXG4gKi9cbmV4cG9ydCBjb25zdCBESVNBQkxFRCA9ICdESVNBQkxFRCc7XG5cbmZ1bmN0aW9uIF9maW5kKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgcGF0aDogQXJyYXk8c3RyaW5nfG51bWJlcj58IHN0cmluZywgZGVsaW1pdGVyOiBzdHJpbmcpIHtcbiAgaWYgKHBhdGggPT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cbiAgaWYgKCEocGF0aCBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgIHBhdGggPSAoPHN0cmluZz5wYXRoKS5zcGxpdChkZWxpbWl0ZXIpO1xuICB9XG4gIGlmIChwYXRoIGluc3RhbmNlb2YgQXJyYXkgJiYgKHBhdGgubGVuZ3RoID09PSAwKSkgcmV0dXJuIG51bGw7XG5cbiAgcmV0dXJuICg8QXJyYXk8c3RyaW5nfG51bWJlcj4+cGF0aCkucmVkdWNlKCh2OiBBYnN0cmFjdENvbnRyb2wsIG5hbWUpID0+IHtcbiAgICBpZiAodiBpbnN0YW5jZW9mIEZvcm1Hcm91cCkge1xuICAgICAgcmV0dXJuIHYuY29udHJvbHMuaGFzT3duUHJvcGVydHkobmFtZSBhcyBzdHJpbmcpID8gdi5jb250cm9sc1tuYW1lXSA6IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHYgaW5zdGFuY2VvZiBGb3JtQXJyYXkpIHtcbiAgICAgIHJldHVybiB2LmF0KDxudW1iZXI+bmFtZSkgfHwgbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfSwgY29udHJvbCk7XG59XG5cbmZ1bmN0aW9uIGNvZXJjZVRvVmFsaWRhdG9yKFxuICAgIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZuIHwgVmFsaWRhdG9yRm5bXSB8IEFic3RyYWN0Q29udHJvbE9wdGlvbnMgfCBudWxsKTogVmFsaWRhdG9yRm58XG4gICAgbnVsbCB7XG4gIGNvbnN0IHZhbGlkYXRvciA9XG4gICAgICAoaXNPcHRpb25zT2JqKHZhbGlkYXRvck9yT3B0cykgPyAodmFsaWRhdG9yT3JPcHRzIGFzIEFic3RyYWN0Q29udHJvbE9wdGlvbnMpLnZhbGlkYXRvcnMgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdG9yT3JPcHRzKSBhcyBWYWxpZGF0b3JGbiB8XG4gICAgICBWYWxpZGF0b3JGbltdIHwgbnVsbDtcblxuICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWxpZGF0b3IpID8gY29tcG9zZVZhbGlkYXRvcnModmFsaWRhdG9yKSA6IHZhbGlkYXRvciB8fCBudWxsO1xufVxuXG5mdW5jdGlvbiBjb2VyY2VUb0FzeW5jVmFsaWRhdG9yKFxuICAgIGFzeW5jVmFsaWRhdG9yPzogQXN5bmNWYWxpZGF0b3JGbiB8IEFzeW5jVmFsaWRhdG9yRm5bXSB8IG51bGwsIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZuIHxcbiAgICAgICAgVmFsaWRhdG9yRm5bXSB8IEFic3RyYWN0Q29udHJvbE9wdGlvbnMgfCBudWxsKTogQXN5bmNWYWxpZGF0b3JGbnxudWxsIHtcbiAgY29uc3Qgb3JpZ0FzeW5jVmFsaWRhdG9yID1cbiAgICAgIChpc09wdGlvbnNPYmoodmFsaWRhdG9yT3JPcHRzKSA/ICh2YWxpZGF0b3JPck9wdHMgYXMgQWJzdHJhY3RDb250cm9sT3B0aW9ucykuYXN5bmNWYWxpZGF0b3JzIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jVmFsaWRhdG9yKSBhcyBBc3luY1ZhbGlkYXRvckZuIHxcbiAgICAgIEFzeW5jVmFsaWRhdG9yRm4gfCBudWxsO1xuXG4gIHJldHVybiBBcnJheS5pc0FycmF5KG9yaWdBc3luY1ZhbGlkYXRvcikgPyBjb21wb3NlQXN5bmNWYWxpZGF0b3JzKG9yaWdBc3luY1ZhbGlkYXRvcikgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ0FzeW5jVmFsaWRhdG9yIHx8IG51bGw7XG59XG5cbmV4cG9ydCB0eXBlIEZvcm1Ib29rcyA9ICdjaGFuZ2UnIHwgJ2JsdXInIHwgJ3N1Ym1pdCc7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBvcHRpb25zIHByb3ZpZGVkIHRvIGFuIGBBYnN0cmFjdENvbnRyb2xgLlxuICpcbiAqIEBleHBlcmltZW50YWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBYnN0cmFjdENvbnRyb2xPcHRpb25zIHtcbiAgLyoqXG4gICAqIExpc3Qgb2YgdmFsaWRhdG9ycyBhcHBsaWVkIHRvIGNvbnRyb2wuXG4gICAqL1xuICB2YWxpZGF0b3JzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxudWxsO1xuICAvKipcbiAgICogTGlzdCBvZiBhc3luYyB2YWxpZGF0b3JzIGFwcGxpZWQgdG8gY29udHJvbC5cbiAgICovXG4gIGFzeW5jVmFsaWRhdG9ycz86IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGw7XG4gIC8qKlxuICAgKiBUaGUgZXZlbnQgbmFtZSBmb3IgY29udHJvbCB0byB1cGRhdGUgdXBvbi5cbiAgICovXG4gIHVwZGF0ZU9uPzogJ2NoYW5nZSd8J2JsdXInfCdzdWJtaXQnO1xufVxuXG5cbmZ1bmN0aW9uIGlzT3B0aW9uc09iaihcbiAgICB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbiB8IFZhbGlkYXRvckZuW10gfCBBYnN0cmFjdENvbnRyb2xPcHRpb25zIHwgbnVsbCk6IGJvb2xlYW4ge1xuICByZXR1cm4gdmFsaWRhdG9yT3JPcHRzICE9IG51bGwgJiYgIUFycmF5LmlzQXJyYXkodmFsaWRhdG9yT3JPcHRzKSAmJlxuICAgICAgdHlwZW9mIHZhbGlkYXRvck9yT3B0cyA9PT0gJ29iamVjdCc7XG59XG5cblxuLyoqXG4gKiBUaGlzIGlzIHRoZSBiYXNlIGNsYXNzIGZvciBgRm9ybUNvbnRyb2xgLCBgRm9ybUdyb3VwYCwgYW5kIGBGb3JtQXJyYXlgLlxuICpcbiAqIEl0IHByb3ZpZGVzIHNvbWUgb2YgdGhlIHNoYXJlZCBiZWhhdmlvciB0aGF0IGFsbCBjb250cm9scyBhbmQgZ3JvdXBzIG9mIGNvbnRyb2xzIGhhdmUsIGxpa2VcbiAqIHJ1bm5pbmcgdmFsaWRhdG9ycywgY2FsY3VsYXRpbmcgc3RhdHVzLCBhbmQgcmVzZXR0aW5nIHN0YXRlLiBJdCBhbHNvIGRlZmluZXMgdGhlIHByb3BlcnRpZXNcbiAqIHRoYXQgYXJlIHNoYXJlZCBiZXR3ZWVuIGFsbCBzdWItY2xhc3NlcywgbGlrZSBgdmFsdWVgLCBgdmFsaWRgLCBhbmQgYGRpcnR5YC4gSXQgc2hvdWxkbid0IGJlXG4gKiBpbnN0YW50aWF0ZWQgZGlyZWN0bHkuXG4gKlxuICogQHNlZSBbRm9ybXMgR3VpZGVdKC9ndWlkZS9mb3JtcylcbiAqIEBzZWUgW1JlYWN0aXZlIEZvcm1zIEd1aWRlXSgvZ3VpZGUvcmVhY3RpdmUtZm9ybXMpXG4gKiBAc2VlIFtEeW5hbWljIEZvcm1zIEd1aWRlXSgvZ3VpZGUvZHluYW1pYy1mb3JtKVxuICpcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFic3RyYWN0Q29udHJvbCB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIF9wZW5kaW5nRGlydHkgITogYm9vbGVhbjtcblxuICAvKiogQGludGVybmFsICovXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBfcGVuZGluZ1RvdWNoZWQgITogYm9vbGVhbjtcblxuICAvKiogQGludGVybmFsICovXG4gIF9vbkNvbGxlY3Rpb25DaGFuZ2UgPSAoKSA9PiB7fTtcblxuICAvKiogQGludGVybmFsICovXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBfdXBkYXRlT24gITogRm9ybUhvb2tzO1xuXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBwcml2YXRlIF9wYXJlbnQgITogRm9ybUdyb3VwIHwgRm9ybUFycmF5O1xuICBwcml2YXRlIF9hc3luY1ZhbGlkYXRpb25TdWJzY3JpcHRpb246IGFueTtcblxuICAvKipcbiAgICogVGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIGNvbnRyb2wuXG4gICAqXG4gICAqICogRm9yIGEgYEZvcm1Db250cm9sYCwgdGhlIGN1cnJlbnQgdmFsdWUuXG4gICAqICogRm9yIGEgYEZvcm1Hcm91cGAsIHRoZSB2YWx1ZXMgb2YgZW5hYmxlZCBjb250cm9scyBhcyBhbiBvYmplY3RcbiAgICogd2l0aCBhIGtleS12YWx1ZSBwYWlyIGZvciBlYWNoIG1lbWJlciBvZiB0aGUgZ3JvdXAuXG4gICAqICogRm9yIGEgYEZvcm1BcnJheWAsIHRoZSB2YWx1ZXMgb2YgZW5hYmxlZCBjb250cm9scyBhcyBhbiBhcnJheS5cbiAgICpcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB2YWx1ZTogYW55O1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBBYnN0cmFjdENvbnRyb2wgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3IgVGhlIGZ1bmN0aW9uIHRoYXQgZGV0ZXJtaW5lcyB0aGUgc3luY2hyb25vdXMgdmFsaWRpdHkgb2YgdGhpcyBjb250cm9sLlxuICAgKiBAcGFyYW0gYXN5bmNWYWxpZGF0b3IgVGhlIGZ1bmN0aW9uIHRoYXQgZGV0ZXJtaW5lcyB0aGUgYXN5bmNocm9ub3VzIHZhbGlkaXR5IG9mIHRoaXNcbiAgICogY29udHJvbC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWxpZGF0b3I6IFZhbGlkYXRvckZufG51bGwsIHB1YmxpYyBhc3luY1ZhbGlkYXRvcjogQXN5bmNWYWxpZGF0b3JGbnxudWxsKSB7fVxuXG4gIC8qKlxuICAgKiBUaGUgcGFyZW50IGNvbnRyb2wuXG4gICAqL1xuICBnZXQgcGFyZW50KCk6IEZvcm1Hcm91cHxGb3JtQXJyYXkgeyByZXR1cm4gdGhpcy5fcGFyZW50OyB9XG5cbiAgLyoqXG4gICAqIFRoZSB2YWxpZGF0aW9uIHN0YXR1cyBvZiB0aGUgY29udHJvbC4gVGhlcmUgYXJlIGZvdXIgcG9zc2libGVcbiAgICogdmFsaWRhdGlvbiBzdGF0dXMgdmFsdWVzOlxuICAgKlxuICAgKiAqICoqVkFMSUQqKjogVGhpcyBjb250cm9sIGhhcyBwYXNzZWQgYWxsIHZhbGlkYXRpb24gY2hlY2tzLlxuICAgKiAqICoqSU5WQUxJRCoqOiBUaGlzIGNvbnRyb2wgaGFzIGZhaWxlZCBhdCBsZWFzdCBvbmUgdmFsaWRhdGlvbiBjaGVjay5cbiAgICogKiAqKlBFTkRJTkcqKjogVGhpcyBjb250cm9sIGlzIGluIHRoZSBtaWRzdCBvZiBjb25kdWN0aW5nIGEgdmFsaWRhdGlvbiBjaGVjay5cbiAgICogKiAqKkRJU0FCTEVEKio6IFRoaXMgY29udHJvbCBpcyBleGVtcHQgZnJvbSB2YWxpZGF0aW9uIGNoZWNrcy5cbiAgICpcbiAgICogVGhlc2Ugc3RhdHVzIHZhbHVlcyBhcmUgbXV0dWFsbHkgZXhjbHVzaXZlLCBzbyBhIGNvbnRyb2wgY2Fubm90IGJlXG4gICAqIGJvdGggdmFsaWQgQU5EIGludmFsaWQgb3IgaW52YWxpZCBBTkQgZGlzYWJsZWQuXG4gICAqL1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHVibGljIHJlYWRvbmx5IHN0YXR1cyAhOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgY29udHJvbCBpcyBgdmFsaWRgIHdoZW4gaXRzIGBzdGF0dXNgIGlzIGBWQUxJRGAuXG4gICAqXG4gICAqIEBzZWUgYHN0YXR1c2BcbiAgICpcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgY29udHJvbCBoYXMgcGFzc2VkIGFsbCBvZiBpdHMgdmFsaWRhdGlvbiB0ZXN0cyxcbiAgICogZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgZ2V0IHZhbGlkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5zdGF0dXMgPT09IFZBTElEOyB9XG5cbiAgLyoqXG4gICAqIEEgY29udHJvbCBpcyBgaW52YWxpZGAgd2hlbiBpdHMgYHN0YXR1c2AgaXMgYElOVkFMSURgLlxuICAgKlxuICAgKiBAc2VlIGBzdGF0dXNgXG4gICAqXG4gICAqIEByZXR1cm5zIFRydWUgaWYgdGhpcyBjb250cm9sIGhhcyBmYWlsZWQgb25lIG9yIG1vcmUgb2YgaXRzIHZhbGlkYXRpb24gY2hlY2tzLFxuICAgKiBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBnZXQgaW52YWxpZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuc3RhdHVzID09PSBJTlZBTElEOyB9XG5cbiAgLyoqXG4gICAqIEEgY29udHJvbCBpcyBgcGVuZGluZ2Agd2hlbiBpdHMgYHN0YXR1c2AgaXMgYFBFTkRJTkdgLlxuICAgKlxuICAgKiBAc2VlIGBzdGF0dXNgXG4gICAqXG4gICAqIEByZXR1cm5zIFRydWUgaWYgdGhpcyBjb250cm9sIGlzIGluIHRoZSBwcm9jZXNzIG9mIGNvbmR1Y3RpbmcgYSB2YWxpZGF0aW9uIGNoZWNrLFxuICAgKiBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBnZXQgcGVuZGluZygpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuc3RhdHVzID09IFBFTkRJTkc7IH1cblxuICAvKipcbiAgICogQSBjb250cm9sIGlzIGBkaXNhYmxlZGAgd2hlbiBpdHMgYHN0YXR1c2AgaXMgYERJU0FCTEVEYC5cbiAgICpcbiAgICogQHNlZSBgc3RhdHVzYFxuICAgKlxuICAgKiBEaXNhYmxlZCBjb250cm9scyBhcmUgZXhlbXB0IGZyb20gdmFsaWRhdGlvbiBjaGVja3MgYW5kXG4gICAqIGFyZSBub3QgaW5jbHVkZWQgaW4gdGhlIGFnZ3JlZ2F0ZSB2YWx1ZSBvZiB0aGVpciBhbmNlc3RvclxuICAgKiBjb250cm9scy5cbiAgICpcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgY29udHJvbCBpcyBkaXNhYmxlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5zdGF0dXMgPT09IERJU0FCTEVEOyB9XG5cbiAgLyoqXG4gICAqIEEgY29udHJvbCBpcyBgZW5hYmxlZGAgYXMgbG9uZyBhcyBpdHMgYHN0YXR1c2AgaXMgbm90IGBESVNBQkxFRGAuXG4gICAqXG4gICAqIEBzZWUgYHN0YXR1c2BcbiAgICpcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgY29udHJvbCBoYXMgYW55IHN0YXR1cyBvdGhlciB0aGFuICdESVNBQkxFRCcsXG4gICAqIGZhbHNlIGlmIHRoZSBzdGF0dXMgaXMgJ0RJU0FCTEVEJy5cbiAgICpcbiAgICovXG4gIGdldCBlbmFibGVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5zdGF0dXMgIT09IERJU0FCTEVEOyB9XG5cbiAgLyoqXG4gICAqIEFuIG9iamVjdCBjb250YWluaW5nIGFueSBlcnJvcnMgZ2VuZXJhdGVkIGJ5IGZhaWxpbmcgdmFsaWRhdGlvbixcbiAgICogb3IgbnVsbCBpZiB0aGVyZSBhcmUgbm8gZXJyb3JzLlxuICAgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHB1YmxpYyByZWFkb25seSBlcnJvcnMgITogVmFsaWRhdGlvbkVycm9ycyB8IG51bGw7XG5cbiAgLyoqXG4gICAqIEEgY29udHJvbCBpcyBgcHJpc3RpbmVgIGlmIHRoZSB1c2VyIGhhcyBub3QgeWV0IGNoYW5nZWRcbiAgICogdGhlIHZhbHVlIGluIHRoZSBVSS5cbiAgICpcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgdXNlciBoYXMgbm90IHlldCBjaGFuZ2VkIHRoZSB2YWx1ZSBpbiB0aGUgVUk7IGNvbXBhcmUgYGRpcnR5YC5cbiAgICogUHJvZ3JhbW1hdGljIGNoYW5nZXMgdG8gYSBjb250cm9sJ3MgdmFsdWUgZG8gbm90IG1hcmsgaXQgZGlydHkuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcHJpc3RpbmU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgYGRpcnR5YCBpZiB0aGUgdXNlciBoYXMgY2hhbmdlZCB0aGUgdmFsdWVcbiAgICogaW4gdGhlIFVJLlxuICAgKlxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSB1c2VyIGhhcyBjaGFuZ2VkIHRoZSB2YWx1ZSBvZiB0aGlzIGNvbnRyb2wgaW4gdGhlIFVJOyBjb21wYXJlIGBwcmlzdGluZWAuXG4gICAqIFByb2dyYW1tYXRpYyBjaGFuZ2VzIHRvIGEgY29udHJvbCdzIHZhbHVlIGRvIG5vdCBtYXJrIGl0IGRpcnR5LlxuICAgKi9cbiAgZ2V0IGRpcnR5KCk6IGJvb2xlYW4geyByZXR1cm4gIXRoaXMucHJpc3RpbmU7IH1cblxuICAvKipcbiAgICogVHJ1ZSBpZiB0aGUgY29udHJvbCBpcyBtYXJrZWQgYXMgYHRvdWNoZWRgLlxuICAgKlxuICAgKiBBIGNvbnRyb2wgaXMgbWFya2VkIGB0b3VjaGVkYCBvbmNlIHRoZSB1c2VyIGhhcyB0cmlnZ2VyZWRcbiAgICogYSBgYmx1cmAgZXZlbnQgb24gaXQuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgdG91Y2hlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBUcnVlIGlmIHRoZSBjb250cm9sIGhhcyBub3QgYmVlbiBtYXJrZWQgYXMgdG91Y2hlZFxuICAgKlxuICAgKiBBIGNvbnRyb2wgaXMgYHVudG91Y2hlZGAgaWYgdGhlIHVzZXIgaGFzIG5vdCB5ZXQgdHJpZ2dlcmVkXG4gICAqIGEgYGJsdXJgIGV2ZW50IG9uIGl0LlxuICAgKi9cbiAgZ2V0IHVudG91Y2hlZCgpOiBib29sZWFuIHsgcmV0dXJuICF0aGlzLnRvdWNoZWQ7IH1cblxuICAvKipcbiAgICogQSBtdWx0aWNhc3Rpbmcgb2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGFuIGV2ZW50IGV2ZXJ5IHRpbWUgdGhlIHZhbHVlIG9mIHRoZSBjb250cm9sIGNoYW5nZXMsIGluXG4gICAqIHRoZSBVSSBvciBwcm9ncmFtbWF0aWNhbGx5LlxuICAgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHB1YmxpYyByZWFkb25seSB2YWx1ZUNoYW5nZXMgITogT2JzZXJ2YWJsZTxhbnk+O1xuXG4gIC8qKlxuICAgKiBBIG11bHRpY2FzdGluZyBvYnNlcnZhYmxlIHRoYXQgZW1pdHMgYW4gZXZlbnQgZXZlcnkgdGltZSB0aGUgdmFsaWRhdGlvbiBgc3RhdHVzYCBvZiB0aGUgY29udHJvbFxuICAgKiByZWNhbGN1bGF0ZXMuXG4gICAqL1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHVibGljIHJlYWRvbmx5IHN0YXR1c0NoYW5nZXMgITogT2JzZXJ2YWJsZTxhbnk+O1xuXG4gIC8qKlxuICAgKiBSZXBvcnRzIHRoZSB1cGRhdGUgc3RyYXRlZ3kgb2YgdGhlIGBBYnN0cmFjdENvbnRyb2xgIChtZWFuaW5nXG4gICAqIHRoZSBldmVudCBvbiB3aGljaCB0aGUgY29udHJvbCB1cGRhdGVzIGl0c2VsZikuXG4gICAqIFBvc3NpYmxlIHZhbHVlczogYCdjaGFuZ2UnYCB8IGAnYmx1cidgIHwgYCdzdWJtaXQnYFxuICAgKiBEZWZhdWx0IHZhbHVlOiBgJ2NoYW5nZSdgXG4gICAqL1xuICBnZXQgdXBkYXRlT24oKTogRm9ybUhvb2tzIHtcbiAgICByZXR1cm4gdGhpcy5fdXBkYXRlT24gPyB0aGlzLl91cGRhdGVPbiA6ICh0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50LnVwZGF0ZU9uIDogJ2NoYW5nZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHN5bmNocm9ub3VzIHZhbGlkYXRvcnMgdGhhdCBhcmUgYWN0aXZlIG9uIHRoaXMgY29udHJvbC4gIENhbGxpbmdcbiAgICogdGhpcyBvdmVyd3JpdGVzIGFueSBleGlzdGluZyBzeW5jIHZhbGlkYXRvcnMuXG4gICAqL1xuICBzZXRWYWxpZGF0b3JzKG5ld1ZhbGlkYXRvcjogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxudWxsKTogdm9pZCB7XG4gICAgdGhpcy52YWxpZGF0b3IgPSBjb2VyY2VUb1ZhbGlkYXRvcihuZXdWYWxpZGF0b3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGFzeW5jIHZhbGlkYXRvcnMgdGhhdCBhcmUgYWN0aXZlIG9uIHRoaXMgY29udHJvbC4gQ2FsbGluZyB0aGlzXG4gICAqIG92ZXJ3cml0ZXMgYW55IGV4aXN0aW5nIGFzeW5jIHZhbGlkYXRvcnMuXG4gICAqL1xuICBzZXRBc3luY1ZhbGlkYXRvcnMobmV3VmFsaWRhdG9yOiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKTogdm9pZCB7XG4gICAgdGhpcy5hc3luY1ZhbGlkYXRvciA9IGNvZXJjZVRvQXN5bmNWYWxpZGF0b3IobmV3VmFsaWRhdG9yKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbXB0aWVzIG91dCB0aGUgc3luYyB2YWxpZGF0b3IgbGlzdC5cbiAgICovXG4gIGNsZWFyVmFsaWRhdG9ycygpOiB2b2lkIHsgdGhpcy52YWxpZGF0b3IgPSBudWxsOyB9XG5cbiAgLyoqXG4gICAqIEVtcHRpZXMgb3V0IHRoZSBhc3luYyB2YWxpZGF0b3IgbGlzdC5cbiAgICovXG4gIGNsZWFyQXN5bmNWYWxpZGF0b3JzKCk6IHZvaWQgeyB0aGlzLmFzeW5jVmFsaWRhdG9yID0gbnVsbDsgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGUgY29udHJvbCBhcyBgdG91Y2hlZGAuIEEgY29udHJvbCBpcyB0b3VjaGVkIGJ5IGZvY3VzIGFuZFxuICAgKiBibHVyIGV2ZW50cyB0aGF0IGRvIG5vdCBjaGFuZ2UgdGhlIHZhbHVlOyBjb21wYXJlIGBtYXJrQXNEaXJ0eWA7XG4gICAqXG4gICAqICBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlc1xuICAgKiBhbmQgZW1pdHMgZXZlbnRzIGV2ZW50cyBhZnRlciBtYXJraW5nIGlzIGFwcGxpZWQuXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBtYXJrIG9ubHkgdGhpcyBjb250cm9sLiBXaGVuIGZhbHNlIG9yIG5vdCBzdXBwbGllZCxcbiAgICogbWFya3MgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuXG4gICAqL1xuICBtYXJrQXNUb3VjaGVkKG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICAodGhpcyBhc3t0b3VjaGVkOiBib29sZWFufSkudG91Y2hlZCA9IHRydWU7XG5cbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQubWFya0FzVG91Y2hlZChvcHRzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWFya3MgdGhlIGNvbnRyb2wgYXMgYHVudG91Y2hlZGAuXG4gICAqXG4gICAqIElmIHRoZSBjb250cm9sIGhhcyBhbnkgY2hpbGRyZW4sIGFsc28gbWFya3MgYWxsIGNoaWxkcmVuIGFzIGB1bnRvdWNoZWRgXG4gICAqIGFuZCByZWNhbGN1bGF0ZXMgdGhlIGB0b3VjaGVkYCBzdGF0dXMgb2YgYWxsIHBhcmVudCBjb250cm9scy5cbiAgICpcbiAgICogIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzXG4gICAqIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIG1hcmtpbmcgaXMgYXBwbGllZC5cbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIG1hcmsgb25seSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgKiBtYXJrcyBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS5cbiAgICovXG4gIG1hcmtBc1VudG91Y2hlZChvcHRzOiB7b25seVNlbGY/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgKHRoaXMgYXN7dG91Y2hlZDogYm9vbGVhbn0pLnRvdWNoZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9wZW5kaW5nVG91Y2hlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKFxuICAgICAgICAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiB7IGNvbnRyb2wubWFya0FzVW50b3VjaGVkKHtvbmx5U2VsZjogdHJ1ZX0pOyB9KTtcblxuICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgIHRoaXMuX3BhcmVudC5fdXBkYXRlVG91Y2hlZChvcHRzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWFya3MgdGhlIGNvbnRyb2wgYXMgYGRpcnR5YC4gQSBjb250cm9sIGJlY29tZXMgZGlydHkgd2hlblxuICAgKiB0aGUgY29udHJvbCdzIGlzIGNoYW5nZWQgdGhyb3VnaCB0aGUgVUk7IGNvbXBhcmUgYG1hcmtBc1RvdWNoZWRgLlxuICAgKlxuICAgKiAgQHBhcmFtIG9wdHMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXNcbiAgICogYW5kIGVtaXRzIGV2ZW50cyBhZnRlciBtYXJraW5nIGlzIGFwcGxpZWQuXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBtYXJrIG9ubHkgdGhpcyBjb250cm9sLiBXaGVuIGZhbHNlIG9yIG5vdCBzdXBwbGllZCxcbiAgICogbWFya3MgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuXG4gICAqL1xuICBtYXJrQXNEaXJ0eShvcHRzOiB7b25seVNlbGY/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgKHRoaXMgYXN7cHJpc3RpbmU6IGJvb2xlYW59KS5wcmlzdGluZSA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50Lm1hcmtBc0RpcnR5KG9wdHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGUgY29udHJvbCBhcyBgcHJpc3RpbmVgLlxuICAgKlxuICAgKiBJZiB0aGUgY29udHJvbCBoYXMgYW55IGNoaWxkcmVuLCBtYXJrcyBhbGwgY2hpbGRyZW4gYXMgYHByaXN0aW5lYCxcbiAgICogYW5kIHJlY2FsY3VsYXRlcyB0aGUgYHByaXN0aW5lYCBzdGF0dXMgb2YgYWxsIHBhcmVudFxuICAgKiBjb250cm9scy5cbiAgICpcbiAgICogIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgZW1pdHMgZXZlbnRzIGFmdGVyXG4gICAqIG1hcmtpbmcgaXMgYXBwbGllZC5cbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIG1hcmsgb25seSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgKiBtYXJrcyBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS4uXG4gICAqL1xuICBtYXJrQXNQcmlzdGluZShvcHRzOiB7b25seVNlbGY/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgKHRoaXMgYXN7cHJpc3RpbmU6IGJvb2xlYW59KS5wcmlzdGluZSA9IHRydWU7XG4gICAgdGhpcy5fcGVuZGluZ0RpcnR5ID0gZmFsc2U7XG5cbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4geyBjb250cm9sLm1hcmtBc1ByaXN0aW5lKHtvbmx5U2VsZjogdHJ1ZX0pOyB9KTtcblxuICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgIHRoaXMuX3BhcmVudC5fdXBkYXRlUHJpc3RpbmUob3B0cyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoZSBjb250cm9sIGFzIGBwZW5kaW5nYC5cbiAgICpcbiAgICogQSBjb250cm9sIGlzIHBlbmRpbmcgd2hpbGUgdGhlIGNvbnRyb2wgcGVyZm9ybXMgYXN5bmMgdmFsaWRhdGlvbi5cbiAgICpcbiAgICogIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzIGFuZFxuICAgKiBlbWl0cyBldmVudHMgYWZ0ZXIgbWFya2luZyBpcyBhcHBsaWVkLlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLi5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCB0aGUgYHN0YXR1c0NoYW5nZXNgXG4gICAqIG9ic2VydmFibGUgZW1pdHMgYW4gZXZlbnQgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyB0aGUgY29udHJvbCBpcyBtYXJrZWQgcGVuZGluZy5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKlxuICAgKi9cbiAgbWFya0FzUGVuZGluZyhvcHRzOiB7b25seVNlbGY/OiBib29sZWFuLCBlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgKHRoaXMgYXN7c3RhdHVzOiBzdHJpbmd9KS5zdGF0dXMgPSBQRU5ESU5HO1xuXG4gICAgaWYgKG9wdHMuZW1pdEV2ZW50ICE9PSBmYWxzZSkge1xuICAgICAgKHRoaXMuc3RhdHVzQ2hhbmdlcyBhcyBFdmVudEVtaXR0ZXI8YW55PikuZW1pdCh0aGlzLnN0YXR1cyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50Lm1hcmtBc1BlbmRpbmcob3B0cyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERpc2FibGVzIHRoZSBjb250cm9sLiBUaGlzIG1lYW5zIHRoZSBjb250cm9sIGlzIGV4ZW1wdCBmcm9tIHZhbGlkYXRpb24gY2hlY2tzIGFuZFxuICAgKiBleGNsdWRlZCBmcm9tIHRoZSBhZ2dyZWdhdGUgdmFsdWUgb2YgYW55IHBhcmVudC4gSXRzIHN0YXR1cyBpcyBgRElTQUJMRURgLlxuICAgKlxuICAgKiBJZiB0aGUgY29udHJvbCBoYXMgY2hpbGRyZW4sIGFsbCBjaGlsZHJlbiBhcmUgYWxzbyBkaXNhYmxlZC5cbiAgICpcbiAgICogIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlc1xuICAgKiBjaGFuZ2VzIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIGNvbnRyb2wgaXMgZGlzYWJsZWQuXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBtYXJrIG9ubHkgdGhpcyBjb250cm9sLiBXaGVuIGZhbHNlIG9yIG5vdCBzdXBwbGllZCxcbiAgICogbWFya3MgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2BcbiAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpcyBkaXNhYmxlZC5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgZGlzYWJsZShvcHRzOiB7b25seVNlbGY/OiBib29sZWFuLCBlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgKHRoaXMgYXN7c3RhdHVzOiBzdHJpbmd9KS5zdGF0dXMgPSBESVNBQkxFRDtcbiAgICAodGhpcyBhc3tlcnJvcnM6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsfSkuZXJyb3JzID0gbnVsbDtcbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoXG4gICAgICAgIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IHsgY29udHJvbC5kaXNhYmxlKHsuLi5vcHRzLCBvbmx5U2VsZjogdHJ1ZX0pOyB9KTtcbiAgICB0aGlzLl91cGRhdGVWYWx1ZSgpO1xuXG4gICAgaWYgKG9wdHMuZW1pdEV2ZW50ICE9PSBmYWxzZSkge1xuICAgICAgKHRoaXMudmFsdWVDaGFuZ2VzIGFzIEV2ZW50RW1pdHRlcjxhbnk+KS5lbWl0KHRoaXMudmFsdWUpO1xuICAgICAgKHRoaXMuc3RhdHVzQ2hhbmdlcyBhcyBFdmVudEVtaXR0ZXI8c3RyaW5nPikuZW1pdCh0aGlzLnN0YXR1cyk7XG4gICAgfVxuXG4gICAgdGhpcy5fdXBkYXRlQW5jZXN0b3JzKG9wdHMpO1xuICAgIHRoaXMuX29uRGlzYWJsZWRDaGFuZ2UuZm9yRWFjaCgoY2hhbmdlRm4pID0+IGNoYW5nZUZuKHRydWUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbmFibGVzIHRoZSBjb250cm9sLiBUaGlzIG1lYW5zIHRoZSBjb250cm9sIGlzIGluY2x1ZGVkIGluIHZhbGlkYXRpb24gY2hlY2tzIGFuZFxuICAgKiB0aGUgYWdncmVnYXRlIHZhbHVlIG9mIGl0cyBwYXJlbnQuIEl0cyBzdGF0dXMgcmVjYWxjdWxhdGVzIGJhc2VkIG9uIGl0cyB2YWx1ZSBhbmRcbiAgICogaXRzIHZhbGlkYXRvcnMuXG4gICAqXG4gICAqIEJ5IGRlZmF1bHQsIGlmIHRoZSBjb250cm9sIGhhcyBjaGlsZHJlbiwgYWxsIGNoaWxkcmVuIGFyZSBlbmFibGVkLlxuICAgKlxuICAgKiAgQHBhcmFtIG9wdHMgQ29uZmlndXJlIG9wdGlvbnMgdGhhdCBjb250cm9sIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXMgYW5kXG4gICAqIGVtaXRzIGV2ZW50cyB3aGVuIG1hcmtlZCBhcyB1bnRvdWNoZWRcbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIG1hcmsgb25seSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgKiBtYXJrcyBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS4uXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzIGVuYWJsZWQuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICovXG4gIGVuYWJsZShvcHRzOiB7b25seVNlbGY/OiBib29sZWFuLCBlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgKHRoaXMgYXN7c3RhdHVzOiBzdHJpbmd9KS5zdGF0dXMgPSBWQUxJRDtcbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoXG4gICAgICAgIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IHsgY29udHJvbC5lbmFibGUoey4uLm9wdHMsIG9ubHlTZWxmOiB0cnVlfSk7IH0pO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogb3B0cy5lbWl0RXZlbnR9KTtcblxuICAgIHRoaXMuX3VwZGF0ZUFuY2VzdG9ycyhvcHRzKTtcbiAgICB0aGlzLl9vbkRpc2FibGVkQ2hhbmdlLmZvckVhY2goKGNoYW5nZUZuKSA9PiBjaGFuZ2VGbihmYWxzZSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlQW5jZXN0b3JzKG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW59KSB7XG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50LnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0cyk7XG4gICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZVByaXN0aW5lKCk7XG4gICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZVRvdWNoZWQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHBhcmVudCBTZXRzIHRoZSBwYXJlbnQgb2YgdGhlIGNvbnRyb2xcbiAgICovXG4gIHNldFBhcmVudChwYXJlbnQ6IEZvcm1Hcm91cHxGb3JtQXJyYXkpOiB2b2lkIHsgdGhpcy5fcGFyZW50ID0gcGFyZW50OyB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHZhbHVlIG9mIHRoZSBjb250cm9sLiBBYnN0cmFjdCBtZXRob2QgKGltcGxlbWVudGVkIGluIHN1Yi1jbGFzc2VzKS5cbiAgICovXG4gIGFic3RyYWN0IHNldFZhbHVlKHZhbHVlOiBhbnksIG9wdGlvbnM/OiBPYmplY3QpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBQYXRjaGVzIHRoZSB2YWx1ZSBvZiB0aGUgY29udHJvbC4gQWJzdHJhY3QgbWV0aG9kIChpbXBsZW1lbnRlZCBpbiBzdWItY2xhc3NlcykuXG4gICAqL1xuICBhYnN0cmFjdCBwYXRjaFZhbHVlKHZhbHVlOiBhbnksIG9wdGlvbnM/OiBPYmplY3QpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIGNvbnRyb2wuIEFic3RyYWN0IG1ldGhvZCAoaW1wbGVtZW50ZWQgaW4gc3ViLWNsYXNzZXMpLlxuICAgKi9cbiAgYWJzdHJhY3QgcmVzZXQodmFsdWU/OiBhbnksIG9wdGlvbnM/OiBPYmplY3QpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBSZWNhbGN1bGF0ZXMgdGhlIHZhbHVlIGFuZCB2YWxpZGF0aW9uIHN0YXR1cyBvZiB0aGUgY29udHJvbC5cbiAgICpcbiAgICogQnkgZGVmYXVsdCwgaXQgYWxzbyB1cGRhdGVzIHRoZSB2YWx1ZSBhbmQgdmFsaWRpdHkgb2YgaXRzIGFuY2VzdG9ycy5cbiAgICpcbiAgICogQHBhcmFtIG9wdHMgQ29uZmlndXJhdGlvbiBvcHRpb25zIGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzIGFuZCBlbWl0cyBldmVudHNcbiAgICogYWZ0ZXIgdXBkYXRlcyBhbmQgdmFsaWRpdHkgY2hlY2tzIGFyZSBhcHBsaWVkLlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgb25seSB1cGRhdGUgdGhpcyBjb250cm9sLiBXaGVuIGZhbHNlIG9yIG5vdCBzdXBwbGllZCxcbiAgICogdXBkYXRlIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLi5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgXG4gICAqIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXMgdXBkYXRlZC5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRzOiB7b25seVNlbGY/OiBib29sZWFuLCBlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgdGhpcy5fc2V0SW5pdGlhbFN0YXR1cygpO1xuICAgIHRoaXMuX3VwZGF0ZVZhbHVlKCk7XG5cbiAgICBpZiAodGhpcy5lbmFibGVkKSB7XG4gICAgICB0aGlzLl9jYW5jZWxFeGlzdGluZ1N1YnNjcmlwdGlvbigpO1xuICAgICAgKHRoaXMgYXN7ZXJyb3JzOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbH0pLmVycm9ycyA9IHRoaXMuX3J1blZhbGlkYXRvcigpO1xuICAgICAgKHRoaXMgYXN7c3RhdHVzOiBzdHJpbmd9KS5zdGF0dXMgPSB0aGlzLl9jYWxjdWxhdGVTdGF0dXMoKTtcblxuICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSBWQUxJRCB8fCB0aGlzLnN0YXR1cyA9PT0gUEVORElORykge1xuICAgICAgICB0aGlzLl9ydW5Bc3luY1ZhbGlkYXRvcihvcHRzLmVtaXRFdmVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9wdHMuZW1pdEV2ZW50ICE9PSBmYWxzZSkge1xuICAgICAgKHRoaXMudmFsdWVDaGFuZ2VzIGFzIEV2ZW50RW1pdHRlcjxhbnk+KS5lbWl0KHRoaXMudmFsdWUpO1xuICAgICAgKHRoaXMuc3RhdHVzQ2hhbmdlcyBhcyBFdmVudEVtaXR0ZXI8c3RyaW5nPikuZW1pdCh0aGlzLnN0YXR1cyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50LnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0cyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdXBkYXRlVHJlZVZhbGlkaXR5KG9wdHM6IHtlbWl0RXZlbnQ/OiBib29sZWFufSA9IHtlbWl0RXZlbnQ6IHRydWV9KSB7XG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjdHJsOiBBYnN0cmFjdENvbnRyb2wpID0+IGN0cmwuX3VwZGF0ZVRyZWVWYWxpZGl0eShvcHRzKSk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBvcHRzLmVtaXRFdmVudH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2V0SW5pdGlhbFN0YXR1cygpIHtcbiAgICAodGhpcyBhc3tzdGF0dXM6IHN0cmluZ30pLnN0YXR1cyA9IHRoaXMuX2FsbENvbnRyb2xzRGlzYWJsZWQoKSA/IERJU0FCTEVEIDogVkFMSUQ7XG4gIH1cblxuICBwcml2YXRlIF9ydW5WYWxpZGF0b3IoKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgICByZXR1cm4gdGhpcy52YWxpZGF0b3IgPyB0aGlzLnZhbGlkYXRvcih0aGlzKSA6IG51bGw7XG4gIH1cblxuICBwcml2YXRlIF9ydW5Bc3luY1ZhbGlkYXRvcihlbWl0RXZlbnQ/OiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuYXN5bmNWYWxpZGF0b3IpIHtcbiAgICAgICh0aGlzIGFze3N0YXR1czogc3RyaW5nfSkuc3RhdHVzID0gUEVORElORztcbiAgICAgIGNvbnN0IG9icyA9IHRvT2JzZXJ2YWJsZSh0aGlzLmFzeW5jVmFsaWRhdG9yKHRoaXMpKTtcbiAgICAgIHRoaXMuX2FzeW5jVmFsaWRhdGlvblN1YnNjcmlwdGlvbiA9XG4gICAgICAgICAgb2JzLnN1YnNjcmliZSgoZXJyb3JzOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCkgPT4gdGhpcy5zZXRFcnJvcnMoZXJyb3JzLCB7ZW1pdEV2ZW50fSkpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2NhbmNlbEV4aXN0aW5nU3Vic2NyaXB0aW9uKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9hc3luY1ZhbGlkYXRpb25TdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuX2FzeW5jVmFsaWRhdGlvblN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGVycm9ycyBvbiBhIGZvcm0gY29udHJvbCB3aGVuIHJ1bm5pbmcgdmFsaWRhdGlvbnMgbWFudWFsbHksIHJhdGhlciB0aGFuIGF1dG9tYXRpY2FsbHkuXG4gICAqXG4gICAqIENhbGxpbmcgYHNldEVycm9yc2AgYWxzbyB1cGRhdGVzIHRoZSB2YWxpZGl0eSBvZiB0aGUgcGFyZW50IGNvbnRyb2wuXG4gICAqXG4gICAqICMjIyBNYW51YWxseSBzZXQgdGhlIGVycm9ycyBmb3IgYSBjb250cm9sXG4gICAqXG4gICAqIGBgYFxuICAgKiBjb25zdCBsb2dpbiA9IG5ldyBGb3JtQ29udHJvbCgnc29tZUxvZ2luJyk7XG4gICAqIGxvZ2luLnNldEVycm9ycyh7XG4gICAqICAgbm90VW5pcXVlOiB0cnVlXG4gICAqIH0pO1xuICAgKlxuICAgKiBleHBlY3QobG9naW4udmFsaWQpLnRvRXF1YWwoZmFsc2UpO1xuICAgKiBleHBlY3QobG9naW4uZXJyb3JzKS50b0VxdWFsKHsgbm90VW5pcXVlOiB0cnVlIH0pO1xuICAgKlxuICAgKiBsb2dpbi5zZXRWYWx1ZSgnc29tZU90aGVyTG9naW4nKTtcbiAgICpcbiAgICogZXhwZWN0KGxvZ2luLnZhbGlkKS50b0VxdWFsKHRydWUpO1xuICAgKiBgYGBcbiAgICovXG4gIHNldEVycm9ycyhlcnJvcnM6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCwgb3B0czoge2VtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICAodGhpcyBhc3tlcnJvcnM6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsfSkuZXJyb3JzID0gZXJyb3JzO1xuICAgIHRoaXMuX3VwZGF0ZUNvbnRyb2xzRXJyb3JzKG9wdHMuZW1pdEV2ZW50ICE9PSBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIGEgY2hpbGQgY29udHJvbCBnaXZlbiB0aGUgY29udHJvbCdzIG5hbWUgb3IgcGF0aC5cbiAgICpcbiAgICogQHBhcmFtIHBhdGggQSBkb3QtZGVsaW1pdGVkIHN0cmluZyBvciBhcnJheSBvZiBzdHJpbmcvbnVtYmVyIHZhbHVlcyB0aGF0IGRlZmluZSB0aGUgcGF0aCB0byB0aGVcbiAgICogY29udHJvbC5cbiAgICpcbiAgICogIyMjIFJldHJpZXZlIGEgbmVzdGVkIGNvbnRyb2xcbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIHRvIGdldCBhIGBuYW1lYCBjb250cm9sIG5lc3RlZCB3aXRoaW4gYSBgcGVyc29uYCBzdWItZ3JvdXA6XG4gICAqXG4gICAqICogYHRoaXMuZm9ybS5nZXQoJ3BlcnNvbi5uYW1lJyk7YFxuICAgKlxuICAgKiAtT1ItXG4gICAqXG4gICAqICogYHRoaXMuZm9ybS5nZXQoWydwZXJzb24nLCAnbmFtZSddKTtgXG4gICAqL1xuICBnZXQocGF0aDogQXJyYXk8c3RyaW5nfG51bWJlcj58c3RyaW5nKTogQWJzdHJhY3RDb250cm9sfG51bGwgeyByZXR1cm4gX2ZpbmQodGhpcywgcGF0aCwgJy4nKTsgfVxuXG4gIC8qKlxuICAgKiBSZXBvcnRzIGVycm9yIGRhdGEgZm9yIGEgc3BlY2lmaWMgZXJyb3Igb2NjdXJyaW5nIGluIHRoaXMgY29udHJvbCBvciBpbiBhbm90aGVyIGNvbnRyb2wuXG4gICAqXG4gICAqIEBwYXJhbSBlcnJvckNvZGUgVGhlIGVycm9yIGNvZGUgZm9yIHdoaWNoIHRvIHJldHJpZXZlIGRhdGFcbiAgICogQHBhcmFtIHBhdGggVGhlIHBhdGggdG8gYSBjb250cm9sIHRvIGNoZWNrLiBJZiBub3Qgc3VwcGxpZWQsIGNoZWNrcyBmb3IgdGhlIGVycm9yIGluIHRoaXNcbiAgICogY29udHJvbC5cbiAgICpcbiAgICogQHJldHVybnMgVGhlIGVycm9yIGRhdGEgaWYgdGhlIGNvbnRyb2wgd2l0aCB0aGUgZ2l2ZW4gcGF0aCBoYXMgdGhlIGdpdmVuIGVycm9yLCBvdGhlcndpc2UgbnVsbFxuICAgKiBvciB1bmRlZmluZWQuXG4gICAqL1xuICBnZXRFcnJvcihlcnJvckNvZGU6IHN0cmluZywgcGF0aD86IHN0cmluZ1tdKTogYW55IHtcbiAgICBjb25zdCBjb250cm9sID0gcGF0aCA/IHRoaXMuZ2V0KHBhdGgpIDogdGhpcztcbiAgICByZXR1cm4gY29udHJvbCAmJiBjb250cm9sLmVycm9ycyA/IGNvbnRyb2wuZXJyb3JzW2Vycm9yQ29kZV0gOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcG9ydHMgd2hldGhlciB0aGUgY29udHJvbCB3aXRoIHRoZSBnaXZlbiBwYXRoIGhhcyB0aGUgZXJyb3Igc3BlY2lmaWVkLlxuICAgKlxuICAgKiBAcGFyYW0gZXJyb3JDb2RlIFRoZSBlcnJvciBjb2RlIGZvciB3aGljaCB0byByZXRyaWV2ZSBkYXRhXG4gICAqIEBwYXJhbSBwYXRoIFRoZSBwYXRoIHRvIGEgY29udHJvbCB0byBjaGVjay4gSWYgbm90IHN1cHBsaWVkLCBjaGVja3MgZm9yIHRoZSBlcnJvciBpbiB0aGlzXG4gICAqIGNvbnRyb2wuXG4gICAqIEByZXR1cm5zIFRydWUgd2hlbiB0aGUgY29udHJvbCB3aXRoIHRoZSBnaXZlbiBwYXRoIGhhcyB0aGUgZXJyb3IsIG90aGVyd2lzZSBmYWxzZS5cbiAgICovXG4gIGhhc0Vycm9yKGVycm9yQ29kZTogc3RyaW5nLCBwYXRoPzogc3RyaW5nW10pOiBib29sZWFuIHsgcmV0dXJuICEhdGhpcy5nZXRFcnJvcihlcnJvckNvZGUsIHBhdGgpOyB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyB0aGUgdG9wLWxldmVsIGFuY2VzdG9yIG9mIHRoaXMgY29udHJvbC5cbiAgICovXG4gIGdldCByb290KCk6IEFic3RyYWN0Q29udHJvbCB7XG4gICAgbGV0IHg6IEFic3RyYWN0Q29udHJvbCA9IHRoaXM7XG5cbiAgICB3aGlsZSAoeC5fcGFyZW50KSB7XG4gICAgICB4ID0geC5fcGFyZW50O1xuICAgIH1cblxuICAgIHJldHVybiB4O1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdXBkYXRlQ29udHJvbHNFcnJvcnMoZW1pdEV2ZW50OiBib29sZWFuKTogdm9pZCB7XG4gICAgKHRoaXMgYXN7c3RhdHVzOiBzdHJpbmd9KS5zdGF0dXMgPSB0aGlzLl9jYWxjdWxhdGVTdGF0dXMoKTtcblxuICAgIGlmIChlbWl0RXZlbnQpIHtcbiAgICAgICh0aGlzLnN0YXR1c0NoYW5nZXMgYXMgRXZlbnRFbWl0dGVyPHN0cmluZz4pLmVtaXQodGhpcy5zdGF0dXMpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wYXJlbnQpIHtcbiAgICAgIHRoaXMuX3BhcmVudC5fdXBkYXRlQ29udHJvbHNFcnJvcnMoZW1pdEV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9pbml0T2JzZXJ2YWJsZXMoKSB7XG4gICAgKHRoaXMgYXN7dmFsdWVDaGFuZ2VzOiBPYnNlcnZhYmxlPGFueT59KS52YWx1ZUNoYW5nZXMgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgKHRoaXMgYXN7c3RhdHVzQ2hhbmdlczogT2JzZXJ2YWJsZTxhbnk+fSkuc3RhdHVzQ2hhbmdlcyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgfVxuXG5cbiAgcHJpdmF0ZSBfY2FsY3VsYXRlU3RhdHVzKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuX2FsbENvbnRyb2xzRGlzYWJsZWQoKSkgcmV0dXJuIERJU0FCTEVEO1xuICAgIGlmICh0aGlzLmVycm9ycykgcmV0dXJuIElOVkFMSUQ7XG4gICAgaWYgKHRoaXMuX2FueUNvbnRyb2xzSGF2ZVN0YXR1cyhQRU5ESU5HKSkgcmV0dXJuIFBFTkRJTkc7XG4gICAgaWYgKHRoaXMuX2FueUNvbnRyb2xzSGF2ZVN0YXR1cyhJTlZBTElEKSkgcmV0dXJuIElOVkFMSUQ7XG4gICAgcmV0dXJuIFZBTElEO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBhYnN0cmFjdCBfdXBkYXRlVmFsdWUoKTogdm9pZDtcblxuICAvKiogQGludGVybmFsICovXG4gIGFic3RyYWN0IF9mb3JFYWNoQ2hpbGQoY2I6IEZ1bmN0aW9uKTogdm9pZDtcblxuICAvKiogQGludGVybmFsICovXG4gIGFic3RyYWN0IF9hbnlDb250cm9scyhjb25kaXRpb246IEZ1bmN0aW9uKTogYm9vbGVhbjtcblxuICAvKiogQGludGVybmFsICovXG4gIGFic3RyYWN0IF9hbGxDb250cm9sc0Rpc2FibGVkKCk6IGJvb2xlYW47XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBhYnN0cmFjdCBfc3luY1BlbmRpbmdDb250cm9scygpOiBib29sZWFuO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2FueUNvbnRyb2xzSGF2ZVN0YXR1cyhzdGF0dXM6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9hbnlDb250cm9scygoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiBjb250cm9sLnN0YXR1cyA9PT0gc3RhdHVzKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2FueUNvbnRyb2xzRGlydHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2FueUNvbnRyb2xzKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IGNvbnRyb2wuZGlydHkpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYW55Q29udHJvbHNUb3VjaGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9hbnlDb250cm9scygoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiBjb250cm9sLnRvdWNoZWQpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdXBkYXRlUHJpc3RpbmUob3B0czoge29ubHlTZWxmPzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgICh0aGlzIGFze3ByaXN0aW5lOiBib29sZWFufSkucHJpc3RpbmUgPSAhdGhpcy5fYW55Q29udHJvbHNEaXJ0eSgpO1xuXG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50Ll91cGRhdGVQcmlzdGluZShvcHRzKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVUb3VjaGVkKG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICAodGhpcyBhc3t0b3VjaGVkOiBib29sZWFufSkudG91Y2hlZCA9IHRoaXMuX2FueUNvbnRyb2xzVG91Y2hlZCgpO1xuXG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50Ll91cGRhdGVUb3VjaGVkKG9wdHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX29uRGlzYWJsZWRDaGFuZ2U6IEZ1bmN0aW9uW10gPSBbXTtcblxuICAvKiogQGludGVybmFsICovXG4gIF9pc0JveGVkVmFsdWUoZm9ybVN0YXRlOiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdHlwZW9mIGZvcm1TdGF0ZSA9PT0gJ29iamVjdCcgJiYgZm9ybVN0YXRlICE9PSBudWxsICYmXG4gICAgICAgIE9iamVjdC5rZXlzKGZvcm1TdGF0ZSkubGVuZ3RoID09PSAyICYmICd2YWx1ZScgaW4gZm9ybVN0YXRlICYmICdkaXNhYmxlZCcgaW4gZm9ybVN0YXRlO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UoZm46ICgpID0+IHZvaWQpOiB2b2lkIHsgdGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlID0gZm47IH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9zZXRVcGRhdGVTdHJhdGVneShvcHRzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxBYnN0cmFjdENvbnRyb2xPcHRpb25zfG51bGwpOiB2b2lkIHtcbiAgICBpZiAoaXNPcHRpb25zT2JqKG9wdHMpICYmIChvcHRzIGFzIEFic3RyYWN0Q29udHJvbE9wdGlvbnMpLnVwZGF0ZU9uICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZU9uID0gKG9wdHMgYXMgQWJzdHJhY3RDb250cm9sT3B0aW9ucykudXBkYXRlT24gITtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBUcmFja3MgdGhlIHZhbHVlIGFuZCB2YWxpZGF0aW9uIHN0YXR1cyBvZiBhbiBpbmRpdmlkdWFsIGZvcm0gY29udHJvbC5cbiAqXG4gKiBUaGlzIGlzIG9uZSBvZiB0aGUgdGhyZWUgZnVuZGFtZW50YWwgYnVpbGRpbmcgYmxvY2tzIG9mIEFuZ3VsYXIgZm9ybXMsIGFsb25nIHdpdGhcbiAqIGBGb3JtR3JvdXBgIGFuZCBgRm9ybUFycmF5YC4gSXQgZXh0ZW5kcyB0aGUgYEFic3RyYWN0Q29udHJvbGAgY2xhc3MgdGhhdFxuICogaW1wbGVtZW50cyBtb3N0IG9mIHRoZSBiYXNlIGZ1bmN0aW9uYWxpdHkgZm9yIGFjY2Vzc2luZyB0aGUgdmFsdWUsIHZhbGlkYXRpb24gc3RhdHVzLFxuICogdXNlciBpbnRlcmFjdGlvbnMgYW5kIGV2ZW50cy5cbiAqXG4gKiBAc2VlIGBBYnN0cmFjdENvbnRyb2xgXG4gKiBAc2VlIFtSZWFjdGl2ZSBGb3JtcyBHdWlkZV0oZ3VpZGUvcmVhY3RpdmUtZm9ybXMpXG4gKiBAc2VlIFtVc2FnZSBOb3Rlc10oI3VzYWdlLW5vdGVzKVxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIEluaXRpYWxpemluZyBGb3JtIENvbnRyb2xzXG4gKlxuICogSW5zdGFudGlhdGUgYSBgRm9ybUNvbnRyb2xgLCB3aXRoIGFuIGluaXRpYWwgdmFsdWUuXG4gKlxuICogYGBgdHNcbiAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJ3NvbWUgdmFsdWUnKTtcbiAqIGNvbnNvbGUubG9nKGNvbnRyb2wudmFsdWUpOyAgICAgLy8gJ3NvbWUgdmFsdWUnXG4gKmBgYFxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBpbml0aWFsaXplcyB0aGUgY29udHJvbCB3aXRoIGEgZm9ybSBzdGF0ZSBvYmplY3QuIFRoZSBgdmFsdWVgXG4gKiBhbmQgYGRpc2FibGVkYCBrZXlzIGFyZSByZXF1aXJlZCBpbiB0aGlzIGNhc2UuXG4gKlxuICogYGBgdHNcbiAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woeyB2YWx1ZTogJ24vYScsIGRpc2FibGVkOiB0cnVlIH0pO1xuICogY29uc29sZS5sb2coY29udHJvbC52YWx1ZSk7ICAgICAvLyAnbi9hJ1xuICogY29uc29sZS5sb2coY29udHJvbC5zdGF0dXMpOyAgICAvLyAnRElTQUJMRUQnXG4gKiBgYGBcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgaW5pdGlhbGl6ZXMgdGhlIGNvbnRyb2wgd2l0aCBhIHN5bmMgdmFsaWRhdG9yLlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBjb250cm9sID0gbmV3IEZvcm1Db250cm9sKCcnLCBWYWxpZGF0b3JzLnJlcXVpcmVkKTtcbiAqIGNvbnNvbGUubG9nKGNvbnRyb2wudmFsdWUpOyAgICAgIC8vICcnXG4gKiBjb25zb2xlLmxvZyhjb250cm9sLnN0YXR1cyk7ICAgICAvLyAnSU5WQUxJRCdcbiAqIGBgYFxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBpbml0aWFsaXplcyB0aGUgY29udHJvbCB1c2luZyBhbiBvcHRpb25zIG9iamVjdC5cbiAqXG4gKiBgYGB0c1xuICogY29uc3QgY29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgnJywge1xuICogICAgdmFsaWRhdG9yczogVmFsaWRhdG9ycy5yZXF1aXJlZCxcbiAqICAgIGFzeW5jVmFsaWRhdG9yczogbXlBc3luY1ZhbGlkYXRvclxuICogfSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgQ29uZmlndXJlIHRoZSBjb250cm9sIHRvIHVwZGF0ZSBvbiBhIGJsdXIgZXZlbnRcbiAqXG4gKiBTZXQgdGhlIGB1cGRhdGVPbmAgb3B0aW9uIHRvIGAnYmx1cidgIHRvIHVwZGF0ZSBvbiB0aGUgYmx1ciBgZXZlbnRgLlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBjb250cm9sID0gbmV3IEZvcm1Db250cm9sKCcnLCB7IHVwZGF0ZU9uOiAnYmx1cicgfSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgQ29uZmlndXJlIHRoZSBjb250cm9sIHRvIHVwZGF0ZSBvbiBhIHN1Ym1pdCBldmVudFxuICpcbiAqIFNldCB0aGUgYHVwZGF0ZU9uYCBvcHRpb24gdG8gYCdzdWJtaXQnYCB0byB1cGRhdGUgb24gYSBzdWJtaXQgYGV2ZW50YC5cbiAqXG4gKiBgYGB0c1xuICogY29uc3QgY29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgnJywgeyB1cGRhdGVPbjogJ3N1Ym1pdCcgfSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgUmVzZXQgdGhlIGNvbnRyb2wgYmFjayB0byBhbiBpbml0aWFsIHZhbHVlXG4gKlxuICogWW91IHJlc2V0IHRvIGEgc3BlY2lmaWMgZm9ybSBzdGF0ZSBieSBwYXNzaW5nIHRocm91Z2ggYSBzdGFuZGFsb25lXG4gKiB2YWx1ZSBvciBhIGZvcm0gc3RhdGUgb2JqZWN0IHRoYXQgY29udGFpbnMgYm90aCBhIHZhbHVlIGFuZCBhIGRpc2FibGVkIHN0YXRlXG4gKiAodGhlc2UgYXJlIHRoZSBvbmx5IHR3byBwcm9wZXJ0aWVzIHRoYXQgY2Fubm90IGJlIGNhbGN1bGF0ZWQpLlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBjb250cm9sID0gbmV3IEZvcm1Db250cm9sKCdOYW5jeScpO1xuICpcbiAqIGNvbnNvbGUubG9nKGNvbnRyb2wudmFsdWUpOyAvLyAnTmFuY3knXG4gKlxuICogY29udHJvbC5yZXNldCgnRHJldycpO1xuICpcbiAqIGNvbnNvbGUubG9nKGNvbnRyb2wudmFsdWUpOyAvLyAnRHJldydcbiAqIGBgYFxuICpcbiAqICMjIyBSZXNldCB0aGUgY29udHJvbCBiYWNrIHRvIGFuIGluaXRpYWwgdmFsdWUgYW5kIGRpc2FibGVkXG4gKlxuICogYGBgXG4gKiBjb25zdCBjb250cm9sID0gbmV3IEZvcm1Db250cm9sKCdOYW5jeScpO1xuICpcbiAqIGNvbnNvbGUubG9nKGNvbnRyb2wudmFsdWUpOyAvLyAnTmFuY3knXG4gKiBjb25zb2xlLmxvZyhjb250cm9sLnN0YXR1cyk7IC8vICdWQUxJRCdcbiAqXG4gKiBjb250cm9sLnJlc2V0KHsgdmFsdWU6ICdEcmV3JywgZGlzYWJsZWQ6IHRydWUgfSk7XG4gKlxuICogY29uc29sZS5sb2coY29udHJvbC52YWx1ZSk7IC8vICdEcmV3J1xuICogY29uc29sZS5sb2coY29udHJvbC5zdGF0dXMpOyAvLyAnRElTQUJMRUQnXG4gKlxuKi9cbmV4cG9ydCBjbGFzcyBGb3JtQ29udHJvbCBleHRlbmRzIEFic3RyYWN0Q29udHJvbCB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX29uQ2hhbmdlOiBGdW5jdGlvbltdID0gW107XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcGVuZGluZ1ZhbHVlOiBhbnk7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcGVuZGluZ0NoYW5nZTogYW55O1xuXG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYEZvcm1Db250cm9sYCBpbnN0YW5jZS5cbiAgKlxuICAqIEBwYXJhbSBmb3JtU3RhdGUgSW5pdGlhbGl6ZXMgdGhlIGNvbnRyb2wgd2l0aCBhbiBpbml0aWFsIHZhbHVlLFxuICAqIG9yIGFuIG9iamVjdCB0aGF0IGRlZmluZXMgdGhlIGluaXRpYWwgdmFsdWUgYW5kIGRpc2FibGVkIHN0YXRlLlxuICAqXG4gICogQHBhcmFtIHZhbGlkYXRvck9yT3B0cyBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiwgb3IgYW4gYXJyYXkgb2ZcbiAgKiBzdWNoIGZ1bmN0aW9ucywgb3IgYW4gYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIG9iamVjdCB0aGF0IGNvbnRhaW5zIHZhbGlkYXRpb24gZnVuY3Rpb25zXG4gICogYW5kIGEgdmFsaWRhdGlvbiB0cmlnZ2VyLlxuICAqXG4gICogQHBhcmFtIGFzeW5jVmFsaWRhdG9yIEEgc2luZ2xlIGFzeW5jIHZhbGlkYXRvciBvciBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3IgZnVuY3Rpb25zXG4gICpcbiAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgICBmb3JtU3RhdGU6IGFueSA9IG51bGwsXG4gICAgICB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfEFic3RyYWN0Q29udHJvbE9wdGlvbnN8bnVsbCxcbiAgICAgIGFzeW5jVmFsaWRhdG9yPzogQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW118bnVsbCkge1xuICAgIHN1cGVyKFxuICAgICAgICBjb2VyY2VUb1ZhbGlkYXRvcih2YWxpZGF0b3JPck9wdHMpLFxuICAgICAgICBjb2VyY2VUb0FzeW5jVmFsaWRhdG9yKGFzeW5jVmFsaWRhdG9yLCB2YWxpZGF0b3JPck9wdHMpKTtcbiAgICB0aGlzLl9hcHBseUZvcm1TdGF0ZShmb3JtU3RhdGUpO1xuICAgIHRoaXMuX3NldFVwZGF0ZVN0cmF0ZWd5KHZhbGlkYXRvck9yT3B0cyk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBmYWxzZX0pO1xuICAgIHRoaXMuX2luaXRPYnNlcnZhYmxlcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYSBuZXcgdmFsdWUgZm9yIHRoZSBmb3JtIGNvbnRyb2wuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgbmV3IHZhbHVlIGZvciB0aGUgY29udHJvbC5cbiAgICogQHBhcmFtIG9wdGlvbnMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9vcGFnYXRlcyBjaGFuZ2VzXG4gICAqIGFuZCBlbWl0cyBldmVudHMgd2hlbiB0aGUgdmFsdWUgY2hhbmdlcy5cbiAgICogVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBhcmUgcGFzc2VkIHRvIHRoZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sI3VwZGF0ZVZhbHVlQW5kVmFsaWRpdHlcbiAgICogdXBkYXRlVmFsdWVBbmRWYWxpZGl0eX0gbWV0aG9kLlxuICAgKlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgZWFjaCBjaGFuZ2Ugb25seSBhZmZlY3RzIHRoaXMgY29udHJvbCwgYW5kIG5vdCBpdHMgcGFyZW50LiBEZWZhdWx0IGlzXG4gICAqIGZhbHNlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2BcbiAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCB2YWx1ZSBpcyB1cGRhdGVkLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqICogYGVtaXRNb2RlbFRvVmlld0NoYW5nZWA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgICh0aGUgZGVmYXVsdCksIGVhY2ggY2hhbmdlIHRyaWdnZXJzIGFuXG4gICAqIGBvbkNoYW5nZWAgZXZlbnQgdG9cbiAgICogdXBkYXRlIHRoZSB2aWV3LlxuICAgKiAqIGBlbWl0Vmlld1RvTW9kZWxDaGFuZ2VgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGVhY2ggY2hhbmdlIHRyaWdnZXJzIGFuXG4gICAqIGBuZ01vZGVsQ2hhbmdlYFxuICAgKiBldmVudCB0byB1cGRhdGUgdGhlIG1vZGVsLlxuICAgKlxuICAgKi9cbiAgc2V0VmFsdWUodmFsdWU6IGFueSwgb3B0aW9uczoge1xuICAgIG9ubHlTZWxmPzogYm9vbGVhbixcbiAgICBlbWl0RXZlbnQ/OiBib29sZWFuLFxuICAgIGVtaXRNb2RlbFRvVmlld0NoYW5nZT86IGJvb2xlYW4sXG4gICAgZW1pdFZpZXdUb01vZGVsQ2hhbmdlPzogYm9vbGVhblxuICB9ID0ge30pOiB2b2lkIHtcbiAgICAodGhpcyBhc3t2YWx1ZTogYW55fSkudmFsdWUgPSB0aGlzLl9wZW5kaW5nVmFsdWUgPSB2YWx1ZTtcbiAgICBpZiAodGhpcy5fb25DaGFuZ2UubGVuZ3RoICYmIG9wdGlvbnMuZW1pdE1vZGVsVG9WaWV3Q2hhbmdlICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5fb25DaGFuZ2UuZm9yRWFjaChcbiAgICAgICAgICAoY2hhbmdlRm4pID0+IGNoYW5nZUZuKHRoaXMudmFsdWUsIG9wdGlvbnMuZW1pdFZpZXdUb01vZGVsQ2hhbmdlICE9PSBmYWxzZSkpO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUGF0Y2hlcyB0aGUgdmFsdWUgb2YgYSBjb250cm9sLlxuICAgKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGlzIGZ1bmN0aW9uYWxseSB0aGUgc2FtZSBhcyB7QGxpbmsgRm9ybUNvbnRyb2wjc2V0VmFsdWUgc2V0VmFsdWV9IGF0IHRoaXMgbGV2ZWwuXG4gICAqIEl0IGV4aXN0cyBmb3Igc3ltbWV0cnkgd2l0aCB7QGxpbmsgRm9ybUdyb3VwI3BhdGNoVmFsdWUgcGF0Y2hWYWx1ZX0gb24gYEZvcm1Hcm91cHNgIGFuZFxuICAgKiBgRm9ybUFycmF5c2AsIHdoZXJlIGl0IGRvZXMgYmVoYXZlIGRpZmZlcmVudGx5LlxuICAgKlxuICAgKiBAc2VlIGBzZXRWYWx1ZWAgZm9yIG9wdGlvbnNcbiAgICovXG4gIHBhdGNoVmFsdWUodmFsdWU6IGFueSwgb3B0aW9uczoge1xuICAgIG9ubHlTZWxmPzogYm9vbGVhbixcbiAgICBlbWl0RXZlbnQ/OiBib29sZWFuLFxuICAgIGVtaXRNb2RlbFRvVmlld0NoYW5nZT86IGJvb2xlYW4sXG4gICAgZW1pdFZpZXdUb01vZGVsQ2hhbmdlPzogYm9vbGVhblxuICB9ID0ge30pOiB2b2lkIHtcbiAgICB0aGlzLnNldFZhbHVlKHZhbHVlLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIGZvcm0gY29udHJvbCwgbWFya2luZyBpdCBgcHJpc3RpbmVgIGFuZCBgdW50b3VjaGVkYCwgYW5kIHNldHRpbmdcbiAgICogdGhlIHZhbHVlIHRvIG51bGwuXG4gICAqXG4gICAqIEBwYXJhbSBmb3JtU3RhdGUgUmVzZXRzIHRoZSBjb250cm9sIHdpdGggYW4gaW5pdGlhbCB2YWx1ZSxcbiAgICogb3IgYW4gb2JqZWN0IHRoYXQgZGVmaW5lcyB0aGUgaW5pdGlhbCB2YWx1ZSBhbmQgZGlzYWJsZWQgc3RhdGUuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzXG4gICAqIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIHZhbHVlIGNoYW5nZXMuXG4gICAqXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBlYWNoIGNoYW5nZSBvbmx5IGFmZmVjdHMgdGhpcyBjb250cm9sLCBhbmQgbm90IGl0cyBwYXJlbnQuIERlZmF1bHQgaXNcbiAgICogZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzIHJlc2V0LlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqXG4gICAqL1xuICByZXNldChmb3JtU3RhdGU6IGFueSA9IG51bGwsIG9wdGlvbnM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICB0aGlzLl9hcHBseUZvcm1TdGF0ZShmb3JtU3RhdGUpO1xuICAgIHRoaXMubWFya0FzUHJpc3RpbmUob3B0aW9ucyk7XG4gICAgdGhpcy5tYXJrQXNVbnRvdWNoZWQob3B0aW9ucyk7XG4gICAgdGhpcy5zZXRWYWx1ZSh0aGlzLnZhbHVlLCBvcHRpb25zKTtcbiAgICB0aGlzLl9wZW5kaW5nQ2hhbmdlID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBfdXBkYXRlVmFsdWUoKSB7fVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIF9hbnlDb250cm9scyhjb25kaXRpb246IEZ1bmN0aW9uKTogYm9vbGVhbiB7IHJldHVybiBmYWxzZTsgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIF9hbGxDb250cm9sc0Rpc2FibGVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5kaXNhYmxlZDsgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGxpc3RlbmVyIGZvciBjaGFuZ2UgZXZlbnRzLlxuICAgKlxuICAgKiBAcGFyYW0gZm4gVGhlIG1ldGhvZCB0aGF0IGlzIGNhbGxlZCB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VzXG4gICAqL1xuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBGdW5jdGlvbik6IHZvaWQgeyB0aGlzLl9vbkNoYW5nZS5wdXNoKGZuKTsgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIF9jbGVhckNoYW5nZUZucygpOiB2b2lkIHtcbiAgICB0aGlzLl9vbkNoYW5nZSA9IFtdO1xuICAgIHRoaXMuX29uRGlzYWJsZWRDaGFuZ2UgPSBbXTtcbiAgICB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UgPSAoKSA9PiB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGxpc3RlbmVyIGZvciBkaXNhYmxlZCBldmVudHMuXG4gICAqXG4gICAqIEBwYXJhbSBmbiBUaGUgbWV0aG9kIHRoYXQgaXMgY2FsbGVkIHdoZW4gdGhlIGRpc2FibGVkIHN0YXR1cyBjaGFuZ2VzLlxuICAgKi9cbiAgcmVnaXN0ZXJPbkRpc2FibGVkQ2hhbmdlKGZuOiAoaXNEaXNhYmxlZDogYm9vbGVhbikgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuX29uRGlzYWJsZWRDaGFuZ2UucHVzaChmbik7XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBfZm9yRWFjaENoaWxkKGNiOiBGdW5jdGlvbik6IHZvaWQge31cblxuICAvKiogQGludGVybmFsICovXG4gIF9zeW5jUGVuZGluZ0NvbnRyb2xzKCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLnVwZGF0ZU9uID09PSAnc3VibWl0Jykge1xuICAgICAgaWYgKHRoaXMuX3BlbmRpbmdEaXJ0eSkgdGhpcy5tYXJrQXNEaXJ0eSgpO1xuICAgICAgaWYgKHRoaXMuX3BlbmRpbmdUb3VjaGVkKSB0aGlzLm1hcmtBc1RvdWNoZWQoKTtcbiAgICAgIGlmICh0aGlzLl9wZW5kaW5nQ2hhbmdlKSB7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5fcGVuZGluZ1ZhbHVlLCB7b25seVNlbGY6IHRydWUsIGVtaXRNb2RlbFRvVmlld0NoYW5nZTogZmFsc2V9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgX2FwcGx5Rm9ybVN0YXRlKGZvcm1TdGF0ZTogYW55KSB7XG4gICAgaWYgKHRoaXMuX2lzQm94ZWRWYWx1ZShmb3JtU3RhdGUpKSB7XG4gICAgICAodGhpcyBhc3t2YWx1ZTogYW55fSkudmFsdWUgPSB0aGlzLl9wZW5kaW5nVmFsdWUgPSBmb3JtU3RhdGUudmFsdWU7XG4gICAgICBmb3JtU3RhdGUuZGlzYWJsZWQgPyB0aGlzLmRpc2FibGUoe29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IGZhbHNlfSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbmFibGUoe29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IGZhbHNlfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICh0aGlzIGFze3ZhbHVlOiBhbnl9KS52YWx1ZSA9IHRoaXMuX3BlbmRpbmdWYWx1ZSA9IGZvcm1TdGF0ZTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBUcmFja3MgdGhlIHZhbHVlIGFuZCB2YWxpZGl0eSBzdGF0ZSBvZiBhIGdyb3VwIG9mIGBGb3JtQ29udHJvbGAgaW5zdGFuY2VzLlxuICpcbiAqIEEgYEZvcm1Hcm91cGAgYWdncmVnYXRlcyB0aGUgdmFsdWVzIG9mIGVhY2ggY2hpbGQgYEZvcm1Db250cm9sYCBpbnRvIG9uZSBvYmplY3QsXG4gKiB3aXRoIGVhY2ggY29udHJvbCBuYW1lIGFzIHRoZSBrZXkuICBJdCBjYWxjdWxhdGVzIGl0cyBzdGF0dXMgYnkgcmVkdWNpbmcgdGhlIHN0YXR1cyB2YWx1ZXNcbiAqIG9mIGl0cyBjaGlsZHJlbi4gRm9yIGV4YW1wbGUsIGlmIG9uZSBvZiB0aGUgY29udHJvbHMgaW4gYSBncm91cCBpcyBpbnZhbGlkLCB0aGUgZW50aXJlXG4gKiBncm91cCBiZWNvbWVzIGludmFsaWQuXG4gKlxuICogYEZvcm1Hcm91cGAgaXMgb25lIG9mIHRoZSB0aHJlZSBmdW5kYW1lbnRhbCBidWlsZGluZyBibG9ja3MgdXNlZCB0byBkZWZpbmUgZm9ybXMgaW4gQW5ndWxhcixcbiAqIGFsb25nIHdpdGggYEZvcm1Db250cm9sYCBhbmQgYEZvcm1BcnJheWAuXG4gKlxuICogV2hlbiBpbnN0YW50aWF0aW5nIGEgYEZvcm1Hcm91cGAsIHBhc3MgaW4gYSBjb2xsZWN0aW9uIG9mIGNoaWxkIGNvbnRyb2xzIGFzIHRoZSBmaXJzdFxuICogYXJndW1lbnQuIFRoZSBrZXkgZm9yIGVhY2ggY2hpbGQgcmVnaXN0ZXJzIHRoZSBuYW1lIGZvciB0aGUgY29udHJvbC5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBDcmVhdGUgYSBmb3JtIGdyb3VwIHdpdGggMiBjb250cm9sc1xuICpcbiAqIGBgYFxuICogY29uc3QgZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICogICBmaXJzdDogbmV3IEZvcm1Db250cm9sKCdOYW5jeScsIFZhbGlkYXRvcnMubWluTGVuZ3RoKDIpKSxcbiAqICAgbGFzdDogbmV3IEZvcm1Db250cm9sKCdEcmV3JyksXG4gKiB9KTtcbiAqXG4gKiBjb25zb2xlLmxvZyhmb3JtLnZhbHVlKTsgICAvLyB7Zmlyc3Q6ICdOYW5jeScsIGxhc3Q7ICdEcmV3J31cbiAqIGNvbnNvbGUubG9nKGZvcm0uc3RhdHVzKTsgIC8vICdWQUxJRCdcbiAqIGBgYFxuICpcbiAqICMjIyBDcmVhdGUgYSBmb3JtIGdyb3VwIHdpdGggYSBncm91cC1sZXZlbCB2YWxpZGF0b3JcbiAqXG4gKiBZb3UgaW5jbHVkZSBncm91cC1sZXZlbCB2YWxpZGF0b3JzIGFzIHRoZSBzZWNvbmQgYXJnLCBvciBncm91cC1sZXZlbCBhc3luY1xuICogdmFsaWRhdG9ycyBhcyB0aGUgdGhpcmQgYXJnLiBUaGVzZSBjb21lIGluIGhhbmR5IHdoZW4geW91IHdhbnQgdG8gcGVyZm9ybSB2YWxpZGF0aW9uXG4gKiB0aGF0IGNvbnNpZGVycyB0aGUgdmFsdWUgb2YgbW9yZSB0aGFuIG9uZSBjaGlsZCBjb250cm9sLlxuICpcbiAqIGBgYFxuICogY29uc3QgZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICogICBwYXNzd29yZDogbmV3IEZvcm1Db250cm9sKCcnLCBWYWxpZGF0b3JzLm1pbkxlbmd0aCgyKSksXG4gKiAgIHBhc3N3b3JkQ29uZmlybTogbmV3IEZvcm1Db250cm9sKCcnLCBWYWxpZGF0b3JzLm1pbkxlbmd0aCgyKSksXG4gKiB9LCBwYXNzd29yZE1hdGNoVmFsaWRhdG9yKTtcbiAqXG4gKlxuICogZnVuY3Rpb24gcGFzc3dvcmRNYXRjaFZhbGlkYXRvcihnOiBGb3JtR3JvdXApIHtcbiAqICAgIHJldHVybiBnLmdldCgncGFzc3dvcmQnKS52YWx1ZSA9PT0gZy5nZXQoJ3Bhc3N3b3JkQ29uZmlybScpLnZhbHVlXG4gKiAgICAgICA/IG51bGwgOiB7J21pc21hdGNoJzogdHJ1ZX07XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBMaWtlIGBGb3JtQ29udHJvbGAgaW5zdGFuY2VzLCB5b3UgY2hvb3NlIHRvIHBhc3MgaW5cbiAqIHZhbGlkYXRvcnMgYW5kIGFzeW5jIHZhbGlkYXRvcnMgYXMgcGFydCBvZiBhbiBvcHRpb25zIG9iamVjdC5cbiAqXG4gKiBgYGBcbiAqIGNvbnN0IGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAqICAgcGFzc3dvcmQ6IG5ldyBGb3JtQ29udHJvbCgnJylcbiAqICAgcGFzc3dvcmRDb25maXJtOiBuZXcgRm9ybUNvbnRyb2woJycpXG4gKiB9LCB7IHZhbGlkYXRvcnM6IHBhc3N3b3JkTWF0Y2hWYWxpZGF0b3IsIGFzeW5jVmFsaWRhdG9yczogb3RoZXJWYWxpZGF0b3IgfSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgU2V0IHRoZSB1cGRhdGVPbiBwcm9wZXJ0eSBmb3IgYWxsIGNvbnRyb2xzIGluIGEgZm9ybSBncm91cFxuICpcbiAqIFRoZSBvcHRpb25zIG9iamVjdCBpcyB1c2VkIHRvIHNldCBhIGRlZmF1bHQgdmFsdWUgZm9yIGVhY2ggY2hpbGRcbiAqIGNvbnRyb2wncyBgdXBkYXRlT25gIHByb3BlcnR5LiBJZiB5b3Ugc2V0IGB1cGRhdGVPbmAgdG8gYCdibHVyJ2AgYXQgdGhlXG4gKiBncm91cCBsZXZlbCwgYWxsIGNoaWxkIGNvbnRyb2xzIGRlZmF1bHQgdG8gJ2JsdXInLCB1bmxlc3MgdGhlIGNoaWxkXG4gKiBoYXMgZXhwbGljaXRseSBzcGVjaWZpZWQgYSBkaWZmZXJlbnQgYHVwZGF0ZU9uYCB2YWx1ZS5cbiAqXG4gKiBgYGB0c1xuICogY29uc3QgYyA9IG5ldyBGb3JtR3JvdXAoe1xuICogICBvbmU6IG5ldyBGb3JtQ29udHJvbCgpXG4gKiB9LCB7IHVwZGF0ZU9uOiAnYmx1cicgfSk7XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNsYXNzIEZvcm1Hcm91cCBleHRlbmRzIEFic3RyYWN0Q29udHJvbCB7XG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYEZvcm1Hcm91cGAgaW5zdGFuY2UuXG4gICpcbiAgKiBAcGFyYW0gY29udHJvbHMgQSBjb2xsZWN0aW9uIG9mIGNoaWxkIGNvbnRyb2xzLiBUaGUga2V5IGZvciBlYWNoIGNoaWxkIGlzIHRoZSBuYW1lXG4gICogdW5kZXIgd2hpY2ggaXQgaXMgcmVnaXN0ZXJlZC5cbiAgKlxuICAqIEBwYXJhbSB2YWxpZGF0b3JPck9wdHMgQSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24sIG9yIGFuIGFycmF5IG9mXG4gICogc3VjaCBmdW5jdGlvbnMsIG9yIGFuIGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYCBvYmplY3QgdGhhdCBjb250YWlucyB2YWxpZGF0aW9uIGZ1bmN0aW9uc1xuICAqIGFuZCBhIHZhbGlkYXRpb24gdHJpZ2dlci5cbiAgKlxuICAqIEBwYXJhbSBhc3luY1ZhbGlkYXRvciBBIHNpbmdsZSBhc3luYyB2YWxpZGF0b3Igb3IgYXJyYXkgb2YgYXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9uc1xuICAqXG4gICovXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIGNvbnRyb2xzOiB7W2tleTogc3RyaW5nXTogQWJzdHJhY3RDb250cm9sfSxcbiAgICAgIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118QWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKSB7XG4gICAgc3VwZXIoXG4gICAgICAgIGNvZXJjZVRvVmFsaWRhdG9yKHZhbGlkYXRvck9yT3B0cyksXG4gICAgICAgIGNvZXJjZVRvQXN5bmNWYWxpZGF0b3IoYXN5bmNWYWxpZGF0b3IsIHZhbGlkYXRvck9yT3B0cykpO1xuICAgIHRoaXMuX2luaXRPYnNlcnZhYmxlcygpO1xuICAgIHRoaXMuX3NldFVwZGF0ZVN0cmF0ZWd5KHZhbGlkYXRvck9yT3B0cyk7XG4gICAgdGhpcy5fc2V0VXBDb250cm9scygpO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogZmFsc2V9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjb250cm9sIHdpdGggdGhlIGdyb3VwJ3MgbGlzdCBvZiBjb250cm9scy5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgZG9lcyBub3QgdXBkYXRlIHRoZSB2YWx1ZSBvciB2YWxpZGl0eSBvZiB0aGUgY29udHJvbC5cbiAgICogVXNlIHtAbGluayBGb3JtR3JvdXAjYWRkQ29udHJvbCBhZGRDb250cm9sfSBpbnN0ZWFkLlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSBUaGUgY29udHJvbCBuYW1lIHRvIHJlZ2lzdGVyIGluIHRoZSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBjb250cm9sIFByb3ZpZGVzIHRoZSBjb250cm9sIGZvciB0aGUgZ2l2ZW4gbmFtZVxuICAgKi9cbiAgcmVnaXN0ZXJDb250cm9sKG5hbWU6IHN0cmluZywgY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogQWJzdHJhY3RDb250cm9sIHtcbiAgICBpZiAodGhpcy5jb250cm9sc1tuYW1lXSkgcmV0dXJuIHRoaXMuY29udHJvbHNbbmFtZV07XG4gICAgdGhpcy5jb250cm9sc1tuYW1lXSA9IGNvbnRyb2w7XG4gICAgY29udHJvbC5zZXRQYXJlbnQodGhpcyk7XG4gICAgY29udHJvbC5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UodGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlKTtcbiAgICByZXR1cm4gY29udHJvbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBjb250cm9sIHRvIHRoaXMgZ3JvdXAuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGFsc28gdXBkYXRlcyB0aGUgdmFsdWUgYW5kIHZhbGlkaXR5IG9mIHRoZSBjb250cm9sLlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSBUaGUgY29udHJvbCBuYW1lIHRvIGFkZCB0byB0aGUgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gY29udHJvbCBQcm92aWRlcyB0aGUgY29udHJvbCBmb3IgdGhlIGdpdmVuIG5hbWVcbiAgICovXG4gIGFkZENvbnRyb2wobmFtZTogc3RyaW5nLCBjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiB2b2lkIHtcbiAgICB0aGlzLnJlZ2lzdGVyQ29udHJvbChuYW1lLCBjb250cm9sKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKTtcbiAgICB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBjb250cm9sIGZyb20gdGhpcyBncm91cC5cbiAgICpcbiAgICogQHBhcmFtIG5hbWUgVGhlIGNvbnRyb2wgbmFtZSB0byByZW1vdmUgZnJvbSB0aGUgY29sbGVjdGlvblxuICAgKi9cbiAgcmVtb3ZlQ29udHJvbChuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jb250cm9sc1tuYW1lXSkgdGhpcy5jb250cm9sc1tuYW1lXS5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UoKCkgPT4ge30pO1xuICAgIGRlbGV0ZSAodGhpcy5jb250cm9sc1tuYW1lXSk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KCk7XG4gICAgdGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZSBhbiBleGlzdGluZyBjb250cm9sLlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSBUaGUgY29udHJvbCBuYW1lIHRvIHJlcGxhY2UgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIGNvbnRyb2wgUHJvdmlkZXMgdGhlIGNvbnRyb2wgZm9yIHRoZSBnaXZlbiBuYW1lXG4gICAqL1xuICBzZXRDb250cm9sKG5hbWU6IHN0cmluZywgY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY29udHJvbHNbbmFtZV0pIHRoaXMuY29udHJvbHNbbmFtZV0uX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKCgpID0+IHt9KTtcbiAgICBkZWxldGUgKHRoaXMuY29udHJvbHNbbmFtZV0pO1xuICAgIGlmIChjb250cm9sKSB0aGlzLnJlZ2lzdGVyQ29udHJvbChuYW1lLCBjb250cm9sKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKTtcbiAgICB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIHRoZXJlIGlzIGFuIGVuYWJsZWQgY29udHJvbCB3aXRoIHRoZSBnaXZlbiBuYW1lIGluIHRoZSBncm91cC5cbiAgICpcbiAgICogUmVwb3J0cyBmYWxzZSBmb3IgZGlzYWJsZWQgY29udHJvbHMuIElmIHlvdSdkIGxpa2UgdG8gY2hlY2sgZm9yIGV4aXN0ZW5jZSBpbiB0aGUgZ3JvdXBcbiAgICogb25seSwgdXNlIHtAbGluayBBYnN0cmFjdENvbnRyb2wjZ2V0IGdldH0gaW5zdGVhZC5cbiAgICpcbiAgICogQHBhcmFtIG5hbWUgVGhlIGNvbnRyb2wgbmFtZSB0byBjaGVjayBmb3IgZXhpc3RlbmNlIGluIHRoZSBjb2xsZWN0aW9uXG4gICAqXG4gICAqIEByZXR1cm5zIGZhbHNlIGZvciBkaXNhYmxlZCBjb250cm9scywgdHJ1ZSBvdGhlcndpc2UuXG4gICAqL1xuICBjb250YWlucyhjb250cm9sTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbHMuaGFzT3duUHJvcGVydHkoY29udHJvbE5hbWUpICYmIHRoaXMuY29udHJvbHNbY29udHJvbE5hbWVdLmVuYWJsZWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIGBGb3JtR3JvdXBgLiBJdCBhY2NlcHRzIGFuIG9iamVjdCB0aGF0IG1hdGNoZXNcbiAgICogdGhlIHN0cnVjdHVyZSBvZiB0aGUgZ3JvdXAsIHdpdGggY29udHJvbCBuYW1lcyBhcyBrZXlzLlxuICAgKlxuICAgKiAjIyMgU2V0IHRoZSBjb21wbGV0ZSB2YWx1ZSBmb3IgdGhlIGZvcm0gZ3JvdXBcbiAgICpcbiAgICogYGBgXG4gICAqIGNvbnN0IGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAgICogICBmaXJzdDogbmV3IEZvcm1Db250cm9sKCksXG4gICAqICAgbGFzdDogbmV3IEZvcm1Db250cm9sKClcbiAgICogfSk7XG4gICAqXG4gICAqIGNvbnNvbGUubG9nKGZvcm0udmFsdWUpOyAgIC8vIHtmaXJzdDogbnVsbCwgbGFzdDogbnVsbH1cbiAgICpcbiAgICogZm9ybS5zZXRWYWx1ZSh7Zmlyc3Q6ICdOYW5jeScsIGxhc3Q6ICdEcmV3J30pO1xuICAgKiBjb25zb2xlLmxvZyhmb3JtLnZhbHVlKTsgICAvLyB7Zmlyc3Q6ICdOYW5jeScsIGxhc3Q6ICdEcmV3J31cbiAgICpcbiAgICogYGBgXG4gICAqIEB0aHJvd3MgV2hlbiBzdHJpY3QgY2hlY2tzIGZhaWwsIHN1Y2ggYXMgc2V0dGluZyB0aGUgdmFsdWUgb2YgYSBjb250cm9sXG4gICAqIHRoYXQgZG9lc24ndCBleGlzdCBvciBpZiB5b3UgZXhjbHVkaW5nIHRoZSB2YWx1ZSBvZiBhIGNvbnRyb2wuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgbmV3IHZhbHVlIGZvciB0aGUgY29udHJvbCB0aGF0IG1hdGNoZXMgdGhlIHN0cnVjdHVyZSBvZiB0aGUgZ3JvdXAuXG4gICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzXG4gICAqIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIHZhbHVlIGNoYW5nZXMuXG4gICAqIFRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgYXJlIHBhc3NlZCB0byB0aGUge0BsaW5rIEFic3RyYWN0Q29udHJvbCN1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5XG4gICAqIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHl9IG1ldGhvZC5cbiAgICpcbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIGVhY2ggY2hhbmdlIG9ubHkgYWZmZWN0cyB0aGlzIGNvbnRyb2wsIGFuZCBub3QgaXRzIHBhcmVudC4gRGVmYXVsdCBpc1xuICAgKiBmYWxzZS5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgXG4gICAqIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgdmFsdWUgaXMgdXBkYXRlZC5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgc2V0VmFsdWUodmFsdWU6IHtba2V5OiBzdHJpbmddOiBhbnl9LCBvcHRpb25zOiB7b25seVNlbGY/OiBib29sZWFuLCBlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTpcbiAgICAgIHZvaWQge1xuICAgIHRoaXMuX2NoZWNrQWxsVmFsdWVzUHJlc2VudCh2YWx1ZSk7XG4gICAgT2JqZWN0LmtleXModmFsdWUpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICB0aGlzLl90aHJvd0lmQ29udHJvbE1pc3NpbmcobmFtZSk7XG4gICAgICB0aGlzLmNvbnRyb2xzW25hbWVdLnNldFZhbHVlKHZhbHVlW25hbWVdLCB7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnR9KTtcbiAgICB9KTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUGF0Y2hlcyB0aGUgdmFsdWUgb2YgdGhlIGBGb3JtR3JvdXBgLiBJdCBhY2NlcHRzIGFuIG9iamVjdCB3aXRoIGNvbnRyb2xcbiAgICogbmFtZXMgYXMga2V5cywgYW5kIGRvZXMgaXRzIGJlc3QgdG8gbWF0Y2ggdGhlIHZhbHVlcyB0byB0aGUgY29ycmVjdCBjb250cm9sc1xuICAgKiBpbiB0aGUgZ3JvdXAuXG4gICAqXG4gICAqIEl0IGFjY2VwdHMgYm90aCBzdXBlci1zZXRzIGFuZCBzdWItc2V0cyBvZiB0aGUgZ3JvdXAgd2l0aG91dCB0aHJvd2luZyBhbiBlcnJvci5cbiAgICpcbiAgICogIyMjIFBhdGNoIHRoZSB2YWx1ZSBmb3IgYSBmb3JtIGdyb3VwXG4gICAqXG4gICAqICBgYGBcbiAgICogIGNvbnN0IGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAgICogICAgIGZpcnN0OiBuZXcgRm9ybUNvbnRyb2woKSxcbiAgICogICAgIGxhc3Q6IG5ldyBGb3JtQ29udHJvbCgpXG4gICAqICB9KTtcbiAgICogIGNvbnNvbGUubG9nKGZvcm0udmFsdWUpOyAgIC8vIHtmaXJzdDogbnVsbCwgbGFzdDogbnVsbH1cbiAgICpcbiAgICogIGZvcm0ucGF0Y2hWYWx1ZSh7Zmlyc3Q6ICdOYW5jeSd9KTtcbiAgICogIGNvbnNvbGUubG9nKGZvcm0udmFsdWUpOyAgIC8vIHtmaXJzdDogJ05hbmN5JywgbGFzdDogbnVsbH1cbiAgICpcbiAgICogIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIG9iamVjdCB0aGF0IG1hdGNoZXMgdGhlIHN0cnVjdHVyZSBvZiB0aGUgZ3JvdXAuXG4gICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzIGFuZFxuICAgKiBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIHZhbHVlIGlzIHBhdGNoZWQuXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBlYWNoIGNoYW5nZSBvbmx5IGFmZmVjdHMgdGhpcyBjb250cm9sIGFuZCBub3QgaXRzIHBhcmVudC4gRGVmYXVsdCBpc1xuICAgKiB0cnVlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2BcbiAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCB2YWx1ZSBpcyB1cGRhdGVkLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqIFRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgYXJlIHBhc3NlZCB0byB0aGUge0BsaW5rIEFic3RyYWN0Q29udHJvbCN1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5XG4gICAqIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHl9IG1ldGhvZC5cbiAgICovXG4gIHBhdGNoVmFsdWUodmFsdWU6IHtba2V5OiBzdHJpbmddOiBhbnl9LCBvcHRpb25zOiB7b25seVNlbGY/OiBib29sZWFuLCBlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTpcbiAgICAgIHZvaWQge1xuICAgIE9iamVjdC5rZXlzKHZhbHVlKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgaWYgKHRoaXMuY29udHJvbHNbbmFtZV0pIHtcbiAgICAgICAgdGhpcy5jb250cm9sc1tuYW1lXS5wYXRjaFZhbHVlKHZhbHVlW25hbWVdLCB7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnR9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHRoZSBgRm9ybUdyb3VwYCwgbWFya3MgYWxsIGRlc2NlbmRhbnRzIGFyZSBtYXJrZWQgYHByaXN0aW5lYCBhbmQgYHVudG91Y2hlZGAsIGFuZFxuICAgKiB0aGUgdmFsdWUgb2YgYWxsIGRlc2NlbmRhbnRzIHRvIG51bGwuXG4gICAqXG4gICAqIFlvdSByZXNldCB0byBhIHNwZWNpZmljIGZvcm0gc3RhdGUgYnkgcGFzc2luZyBpbiBhIG1hcCBvZiBzdGF0ZXNcbiAgICogdGhhdCBtYXRjaGVzIHRoZSBzdHJ1Y3R1cmUgb2YgeW91ciBmb3JtLCB3aXRoIGNvbnRyb2wgbmFtZXMgYXMga2V5cy4gVGhlIHN0YXRlXG4gICAqIGlzIGEgc3RhbmRhbG9uZSB2YWx1ZSBvciBhIGZvcm0gc3RhdGUgb2JqZWN0IHdpdGggYm90aCBhIHZhbHVlIGFuZCBhIGRpc2FibGVkXG4gICAqIHN0YXR1cy5cbiAgICpcbiAgICogQHBhcmFtIGZvcm1TdGF0ZSBSZXNldHMgdGhlIGNvbnRyb2wgd2l0aCBhbiBpbml0aWFsIHZhbHVlLFxuICAgKiBvciBhbiBvYmplY3QgdGhhdCBkZWZpbmVzIHRoZSBpbml0aWFsIHZhbHVlIGFuZCBkaXNhYmxlZCBzdGF0ZS5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXNcbiAgICogYW5kIGVtaXRzIGV2ZW50cyB3aGVuIHRoZSBncm91cCBpcyByZXNldC5cbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIGVhY2ggY2hhbmdlIG9ubHkgYWZmZWN0cyB0aGlzIGNvbnRyb2wsIGFuZCBub3QgaXRzIHBhcmVudC4gRGVmYXVsdCBpc1xuICAgKiBmYWxzZS5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgXG4gICAqIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXMgcmVzZXQuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICogVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBhcmUgcGFzc2VkIHRvIHRoZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sI3VwZGF0ZVZhbHVlQW5kVmFsaWRpdHlcbiAgICogdXBkYXRlVmFsdWVBbmRWYWxpZGl0eX0gbWV0aG9kLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKlxuICAgKiAjIyMgUmVzZXQgdGhlIGZvcm0gZ3JvdXAgdmFsdWVzXG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGNvbnN0IGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAgICogICBmaXJzdDogbmV3IEZvcm1Db250cm9sKCdmaXJzdCBuYW1lJyksXG4gICAqICAgbGFzdDogbmV3IEZvcm1Db250cm9sKCdsYXN0IG5hbWUnKVxuICAgKiB9KTtcbiAgICpcbiAgICogY29uc29sZS5sb2coZm9ybS52YWx1ZSk7ICAvLyB7Zmlyc3Q6ICdmaXJzdCBuYW1lJywgbGFzdDogJ2xhc3QgbmFtZSd9XG4gICAqXG4gICAqIGZvcm0ucmVzZXQoeyBmaXJzdDogJ25hbWUnLCBsYXN0OiAnbGFzdCBuYW1lJyB9KTtcbiAgICpcbiAgICogY29uc29sZS5sb2coZm9ybS52YWx1ZSk7ICAvLyB7Zmlyc3Q6ICduYW1lJywgbGFzdDogJ2xhc3QgbmFtZSd9XG4gICAqIGBgYFxuICAgKlxuICAgKiAjIyMgUmVzZXQgdGhlIGZvcm0gZ3JvdXAgdmFsdWVzIGFuZCBkaXNhYmxlZCBzdGF0dXNcbiAgICpcbiAgICogYGBgXG4gICAqIGNvbnN0IGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAgICogICBmaXJzdDogbmV3IEZvcm1Db250cm9sKCdmaXJzdCBuYW1lJyksXG4gICAqICAgbGFzdDogbmV3IEZvcm1Db250cm9sKCdsYXN0IG5hbWUnKVxuICAgKiB9KTtcbiAgICpcbiAgICogZm9ybS5yZXNldCh7XG4gICAqICAgZmlyc3Q6IHt2YWx1ZTogJ25hbWUnLCBkaXNhYmxlZDogdHJ1ZX0sXG4gICAqICAgbGFzdDogJ2xhc3QnXG4gICAqIH0pO1xuICAgKlxuICAgKiBjb25zb2xlLmxvZyh0aGlzLmZvcm0udmFsdWUpOyAgLy8ge2ZpcnN0OiAnbmFtZScsIGxhc3Q6ICdsYXN0IG5hbWUnfVxuICAgKiBjb25zb2xlLmxvZyh0aGlzLmZvcm0uZ2V0KCdmaXJzdCcpLnN0YXR1cyk7ICAvLyAnRElTQUJMRUQnXG4gICAqIGBgYFxuICAgKi9cbiAgcmVzZXQodmFsdWU6IGFueSA9IHt9LCBvcHRpb25zOiB7b25seVNlbGY/OiBib29sZWFuLCBlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIG5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgY29udHJvbC5yZXNldCh2YWx1ZVtuYW1lXSwge29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50fSk7XG4gICAgfSk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdGlvbnMpO1xuICAgIHRoaXMuX3VwZGF0ZVByaXN0aW5lKG9wdGlvbnMpO1xuICAgIHRoaXMuX3VwZGF0ZVRvdWNoZWQob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGFnZ3JlZ2F0ZSB2YWx1ZSBvZiB0aGUgYEZvcm1Hcm91cGAsIGluY2x1ZGluZyBhbnkgZGlzYWJsZWQgY29udHJvbHMuXG4gICAqXG4gICAqIFJldHJpZXZlcyBhbGwgdmFsdWVzIHJlZ2FyZGxlc3Mgb2YgZGlzYWJsZWQgc3RhdHVzLlxuICAgKiBUaGUgYHZhbHVlYCBwcm9wZXJ0eSBpcyB0aGUgYmVzdCB3YXkgdG8gZ2V0IHRoZSB2YWx1ZSBvZiB0aGUgZ3JvdXAsIGJlY2F1c2VcbiAgICogaXQgZXhjbHVkZXMgZGlzYWJsZWQgY29udHJvbHMgaW4gdGhlIGBGb3JtR3JvdXBgLlxuICAgKi9cbiAgZ2V0UmF3VmFsdWUoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fcmVkdWNlQ2hpbGRyZW4oXG4gICAgICAgIHt9LCAoYWNjOiB7W2s6IHN0cmluZ106IEFic3RyYWN0Q29udHJvbH0sIGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgbmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgYWNjW25hbWVdID0gY29udHJvbCBpbnN0YW5jZW9mIEZvcm1Db250cm9sID8gY29udHJvbC52YWx1ZSA6ICg8YW55PmNvbnRyb2wpLmdldFJhd1ZhbHVlKCk7XG4gICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9zeW5jUGVuZGluZ0NvbnRyb2xzKCk6IGJvb2xlYW4ge1xuICAgIGxldCBzdWJ0cmVlVXBkYXRlZCA9IHRoaXMuX3JlZHVjZUNoaWxkcmVuKGZhbHNlLCAodXBkYXRlZDogYm9vbGVhbiwgY2hpbGQ6IEFic3RyYWN0Q29udHJvbCkgPT4ge1xuICAgICAgcmV0dXJuIGNoaWxkLl9zeW5jUGVuZGluZ0NvbnRyb2xzKCkgPyB0cnVlIDogdXBkYXRlZDtcbiAgICB9KTtcbiAgICBpZiAoc3VidHJlZVVwZGF0ZWQpIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7b25seVNlbGY6IHRydWV9KTtcbiAgICByZXR1cm4gc3VidHJlZVVwZGF0ZWQ7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF90aHJvd0lmQ29udHJvbE1pc3NpbmcobmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKCFPYmplY3Qua2V5cyh0aGlzLmNvbnRyb2xzKS5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXG4gICAgICAgIFRoZXJlIGFyZSBubyBmb3JtIGNvbnRyb2xzIHJlZ2lzdGVyZWQgd2l0aCB0aGlzIGdyb3VwIHlldC4gIElmIHlvdSdyZSB1c2luZyBuZ01vZGVsLFxuICAgICAgICB5b3UgbWF5IHdhbnQgdG8gY2hlY2sgbmV4dCB0aWNrIChlLmcuIHVzZSBzZXRUaW1lb3V0KS5cbiAgICAgIGApO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuY29udHJvbHNbbmFtZV0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGZpbmQgZm9ybSBjb250cm9sIHdpdGggbmFtZTogJHtuYW1lfS5gKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9mb3JFYWNoQ2hpbGQoY2I6ICh2OiBhbnksIGs6IHN0cmluZykgPT4gdm9pZCk6IHZvaWQge1xuICAgIE9iamVjdC5rZXlzKHRoaXMuY29udHJvbHMpLmZvckVhY2goayA9PiBjYih0aGlzLmNvbnRyb2xzW2tdLCBrKSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9zZXRVcENvbnRyb2xzKCk6IHZvaWQge1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiB7XG4gICAgICBjb250cm9sLnNldFBhcmVudCh0aGlzKTtcbiAgICAgIGNvbnRyb2wuX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVWYWx1ZSgpOiB2b2lkIHsgKHRoaXMgYXN7dmFsdWU6IGFueX0pLnZhbHVlID0gdGhpcy5fcmVkdWNlVmFsdWUoKTsgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2FueUNvbnRyb2xzKGNvbmRpdGlvbjogRnVuY3Rpb24pOiBib29sZWFuIHtcbiAgICBsZXQgcmVzID0gZmFsc2U7XG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIG5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgcmVzID0gcmVzIHx8ICh0aGlzLmNvbnRhaW5zKG5hbWUpICYmIGNvbmRpdGlvbihjb250cm9sKSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlZHVjZVZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl9yZWR1Y2VDaGlsZHJlbihcbiAgICAgICAge30sIChhY2M6IHtbazogc3RyaW5nXTogQWJzdHJhY3RDb250cm9sfSwgY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBuYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICBpZiAoY29udHJvbC5lbmFibGVkIHx8IHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIGFjY1tuYW1lXSA9IGNvbnRyb2wudmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0pO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcmVkdWNlQ2hpbGRyZW4oaW5pdFZhbHVlOiBhbnksIGZuOiBGdW5jdGlvbikge1xuICAgIGxldCByZXMgPSBpbml0VmFsdWU7XG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKFxuICAgICAgICAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBuYW1lOiBzdHJpbmcpID0+IHsgcmVzID0gZm4ocmVzLCBjb250cm9sLCBuYW1lKTsgfSk7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2FsbENvbnRyb2xzRGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgZm9yIChjb25zdCBjb250cm9sTmFtZSBvZiBPYmplY3Qua2V5cyh0aGlzLmNvbnRyb2xzKSkge1xuICAgICAgaWYgKHRoaXMuY29udHJvbHNbY29udHJvbE5hbWVdLmVuYWJsZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5jb250cm9scykubGVuZ3RoID4gMCB8fCB0aGlzLmRpc2FibGVkO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY2hlY2tBbGxWYWx1ZXNQcmVzZW50KHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgbmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICBpZiAodmFsdWVbbmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE11c3Qgc3VwcGx5IGEgdmFsdWUgZm9yIGZvcm0gY29udHJvbCB3aXRoIG5hbWU6ICcke25hbWV9Jy5gKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIFRyYWNrcyB0aGUgdmFsdWUgYW5kIHZhbGlkaXR5IHN0YXRlIG9mIGFuIGFycmF5IG9mIGBGb3JtQ29udHJvbGAsXG4gKiBgRm9ybUdyb3VwYCBvciBgRm9ybUFycmF5YCBpbnN0YW5jZXMuXG4gKlxuICogQSBgRm9ybUFycmF5YCBhZ2dyZWdhdGVzIHRoZSB2YWx1ZXMgb2YgZWFjaCBjaGlsZCBgRm9ybUNvbnRyb2xgIGludG8gYW4gYXJyYXkuXG4gKiBJdCBjYWxjdWxhdGVzIGl0cyBzdGF0dXMgYnkgcmVkdWNpbmcgdGhlIHN0YXR1cyB2YWx1ZXMgb2YgaXRzIGNoaWxkcmVuLiBGb3IgZXhhbXBsZSwgaWYgb25lIG9mXG4gKiB0aGUgY29udHJvbHMgaW4gYSBgRm9ybUFycmF5YCBpcyBpbnZhbGlkLCB0aGUgZW50aXJlIGFycmF5IGJlY29tZXMgaW52YWxpZC5cbiAqXG4gKiBgRm9ybUFycmF5YCBpcyBvbmUgb2YgdGhlIHRocmVlIGZ1bmRhbWVudGFsIGJ1aWxkaW5nIGJsb2NrcyB1c2VkIHRvIGRlZmluZSBmb3JtcyBpbiBBbmd1bGFyLFxuICogYWxvbmcgd2l0aCBgRm9ybUNvbnRyb2xgIGFuZCBgRm9ybUdyb3VwYC5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBDcmVhdGUgYW4gYXJyYXkgb2YgZm9ybSBjb250cm9sc1xuICpcbiAqIGBgYFxuICogY29uc3QgYXJyID0gbmV3IEZvcm1BcnJheShbXG4gKiAgIG5ldyBGb3JtQ29udHJvbCgnTmFuY3knLCBWYWxpZGF0b3JzLm1pbkxlbmd0aCgyKSksXG4gKiAgIG5ldyBGb3JtQ29udHJvbCgnRHJldycpLFxuICogXSk7XG4gKlxuICogY29uc29sZS5sb2coYXJyLnZhbHVlKTsgICAvLyBbJ05hbmN5JywgJ0RyZXcnXVxuICogY29uc29sZS5sb2coYXJyLnN0YXR1cyk7ICAvLyAnVkFMSUQnXG4gKiBgYGBcbiAqXG4gKiAjIyMgQ3JlYXRlIGEgZm9ybSBhcnJheSB3aXRoIGFycmF5LWxldmVsIHZhbGlkYXRvcnNcbiAqXG4gKiBZb3UgaW5jbHVkZSBhcnJheS1sZXZlbCB2YWxpZGF0b3JzIGFuZCBhc3luYyB2YWxpZGF0b3JzLiBUaGVzZSBjb21lIGluIGhhbmR5XG4gKiB3aGVuIHlvdSB3YW50IHRvIHBlcmZvcm0gdmFsaWRhdGlvbiB0aGF0IGNvbnNpZGVycyB0aGUgdmFsdWUgb2YgbW9yZSB0aGFuIG9uZSBjaGlsZFxuICogY29udHJvbC5cbiAqXG4gKiBUaGUgdHdvIHR5cGVzIG9mIHZhbGlkYXRvcnMgYXJlIHBhc3NlZCBpbiBzZXBhcmF0ZWx5IGFzIHRoZSBzZWNvbmQgYW5kIHRoaXJkIGFyZ1xuICogcmVzcGVjdGl2ZWx5LCBvciB0b2dldGhlciBhcyBwYXJ0IG9mIGFuIG9wdGlvbnMgb2JqZWN0LlxuICpcbiAqIGBgYFxuICogY29uc3QgYXJyID0gbmV3IEZvcm1BcnJheShbXG4gKiAgIG5ldyBGb3JtQ29udHJvbCgnTmFuY3knKSxcbiAqICAgbmV3IEZvcm1Db250cm9sKCdEcmV3JylcbiAqIF0sIHt2YWxpZGF0b3JzOiBteVZhbGlkYXRvciwgYXN5bmNWYWxpZGF0b3JzOiBteUFzeW5jVmFsaWRhdG9yfSk7XG4gKiBgYGBcbiAqXG4gICogIyMjIFNldCB0aGUgdXBkYXRlT24gcHJvcGVydHkgZm9yIGFsbCBjb250cm9scyBpbiBhIGZvcm0gYXJyYXlcbiAqXG4gKiBUaGUgb3B0aW9ucyBvYmplY3QgaXMgdXNlZCB0byBzZXQgYSBkZWZhdWx0IHZhbHVlIGZvciBlYWNoIGNoaWxkXG4gKiBjb250cm9sJ3MgYHVwZGF0ZU9uYCBwcm9wZXJ0eS4gSWYgeW91IHNldCBgdXBkYXRlT25gIHRvIGAnYmx1cidgIGF0IHRoZVxuICogYXJyYXkgbGV2ZWwsIGFsbCBjaGlsZCBjb250cm9scyBkZWZhdWx0IHRvICdibHVyJywgdW5sZXNzIHRoZSBjaGlsZFxuICogaGFzIGV4cGxpY2l0bHkgc3BlY2lmaWVkIGEgZGlmZmVyZW50IGB1cGRhdGVPbmAgdmFsdWUuXG4gKlxuICogYGBgdHNcbiAqIGNvbnN0IGFyciA9IG5ldyBGb3JtQXJyYXkoW1xuICogICAgbmV3IEZvcm1Db250cm9sKClcbiAqIF0sIHt1cGRhdGVPbjogJ2JsdXInfSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgQWRkaW5nIG9yIHJlbW92aW5nIGNvbnRyb2xzIGZyb20gYSBmb3JtIGFycmF5XG4gKlxuICogVG8gY2hhbmdlIHRoZSBjb250cm9scyBpbiB0aGUgYXJyYXksIHVzZSB0aGUgYHB1c2hgLCBgaW5zZXJ0YCwgb3IgYHJlbW92ZUF0YCBtZXRob2RzXG4gKiBpbiBgRm9ybUFycmF5YCBpdHNlbGYuIFRoZXNlIG1ldGhvZHMgZW5zdXJlIHRoZSBjb250cm9scyBhcmUgcHJvcGVybHkgdHJhY2tlZCBpbiB0aGVcbiAqIGZvcm0ncyBoaWVyYXJjaHkuIERvIG5vdCBtb2RpZnkgdGhlIGFycmF5IG9mIGBBYnN0cmFjdENvbnRyb2xgcyB1c2VkIHRvIGluc3RhbnRpYXRlXG4gKiB0aGUgYEZvcm1BcnJheWAgZGlyZWN0bHksIGFzIHRoYXQgcmVzdWx0IGluIHN0cmFuZ2UgYW5kIHVuZXhwZWN0ZWQgYmVoYXZpb3Igc3VjaFxuICogYXMgYnJva2VuIGNoYW5nZSBkZXRlY3Rpb24uXG4gKlxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIEZvcm1BcnJheSBleHRlbmRzIEFic3RyYWN0Q29udHJvbCB7XG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYEZvcm1BcnJheWAgaW5zdGFuY2UuXG4gICpcbiAgKiBAcGFyYW0gY29udHJvbHMgQW4gYXJyYXkgb2YgY2hpbGQgY29udHJvbHMuIEVhY2ggY2hpbGQgY29udHJvbCBpcyBnaXZlbiBhbiBpbmRleFxuICAqIHdoZWggaXQgaXMgcmVnaXN0ZXJlZC5cbiAgKlxuICAqIEBwYXJhbSB2YWxpZGF0b3JPck9wdHMgQSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24sIG9yIGFuIGFycmF5IG9mXG4gICogc3VjaCBmdW5jdGlvbnMsIG9yIGFuIGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYCBvYmplY3QgdGhhdCBjb250YWlucyB2YWxpZGF0aW9uIGZ1bmN0aW9uc1xuICAqIGFuZCBhIHZhbGlkYXRpb24gdHJpZ2dlci5cbiAgKlxuICAqIEBwYXJhbSBhc3luY1ZhbGlkYXRvciBBIHNpbmdsZSBhc3luYyB2YWxpZGF0b3Igb3IgYXJyYXkgb2YgYXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9uc1xuICAqXG4gICovXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIGNvbnRyb2xzOiBBYnN0cmFjdENvbnRyb2xbXSxcbiAgICAgIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118QWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKSB7XG4gICAgc3VwZXIoXG4gICAgICAgIGNvZXJjZVRvVmFsaWRhdG9yKHZhbGlkYXRvck9yT3B0cyksXG4gICAgICAgIGNvZXJjZVRvQXN5bmNWYWxpZGF0b3IoYXN5bmNWYWxpZGF0b3IsIHZhbGlkYXRvck9yT3B0cykpO1xuICAgIHRoaXMuX2luaXRPYnNlcnZhYmxlcygpO1xuICAgIHRoaXMuX3NldFVwZGF0ZVN0cmF0ZWd5KHZhbGlkYXRvck9yT3B0cyk7XG4gICAgdGhpcy5fc2V0VXBDb250cm9scygpO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogZmFsc2V9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGBBYnN0cmFjdENvbnRyb2xgIGF0IHRoZSBnaXZlbiBgaW5kZXhgIGluIHRoZSBhcnJheS5cbiAgICpcbiAgICogQHBhcmFtIGluZGV4IEluZGV4IGluIHRoZSBhcnJheSB0byByZXRyaWV2ZSB0aGUgY29udHJvbFxuICAgKi9cbiAgYXQoaW5kZXg6IG51bWJlcik6IEFic3RyYWN0Q29udHJvbCB7IHJldHVybiB0aGlzLmNvbnRyb2xzW2luZGV4XTsgfVxuXG4gIC8qKlxuICAgKiBJbnNlcnQgYSBuZXcgYEFic3RyYWN0Q29udHJvbGAgYXQgdGhlIGVuZCBvZiB0aGUgYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSBjb250cm9sIEZvcm0gY29udHJvbCB0byBiZSBpbnNlcnRlZFxuICAgKi9cbiAgcHVzaChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRyb2xzLnB1c2goY29udHJvbCk7XG4gICAgdGhpcy5fcmVnaXN0ZXJDb250cm9sKGNvbnRyb2wpO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpO1xuICAgIHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc2VydCBhIG5ldyBgQWJzdHJhY3RDb250cm9sYCBhdCB0aGUgZ2l2ZW4gYGluZGV4YCBpbiB0aGUgYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSBpbmRleCBJbmRleCBpbiB0aGUgYXJyYXkgdG8gaW5zZXJ0IHRoZSBjb250cm9sXG4gICAqIEBwYXJhbSBjb250cm9sIEZvcm0gY29udHJvbCB0byBiZSBpbnNlcnRlZFxuICAgKi9cbiAgaW5zZXJ0KGluZGV4OiBudW1iZXIsIGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IHZvaWQge1xuICAgIHRoaXMuY29udHJvbHMuc3BsaWNlKGluZGV4LCAwLCBjb250cm9sKTtcblxuICAgIHRoaXMuX3JlZ2lzdGVyQ29udHJvbChjb250cm9sKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgdGhlIGNvbnRyb2wgYXQgdGhlIGdpdmVuIGBpbmRleGAgaW4gdGhlIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0gaW5kZXggSW5kZXggaW4gdGhlIGFycmF5IHRvIHJlbW92ZSB0aGUgY29udHJvbFxuICAgKi9cbiAgcmVtb3ZlQXQoaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLmNvbnRyb2xzW2luZGV4XSkgdGhpcy5jb250cm9sc1tpbmRleF0uX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKCgpID0+IHt9KTtcbiAgICB0aGlzLmNvbnRyb2xzLnNwbGljZShpbmRleCwgMSk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KCk7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZSBhbiBleGlzdGluZyBjb250cm9sLlxuICAgKlxuICAgKiBAcGFyYW0gaW5kZXggSW5kZXggaW4gdGhlIGFycmF5IHRvIHJlcGxhY2UgdGhlIGNvbnRyb2xcbiAgICogQHBhcmFtIGNvbnRyb2wgVGhlIGBBYnN0cmFjdENvbnRyb2xgIGNvbnRyb2wgdG8gcmVwbGFjZSB0aGUgZXhpc3RpbmcgY29udHJvbFxuICAgKi9cbiAgc2V0Q29udHJvbChpbmRleDogbnVtYmVyLCBjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jb250cm9sc1tpbmRleF0pIHRoaXMuY29udHJvbHNbaW5kZXhdLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSgoKSA9PiB7fSk7XG4gICAgdGhpcy5jb250cm9scy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgaWYgKGNvbnRyb2wpIHtcbiAgICAgIHRoaXMuY29udHJvbHMuc3BsaWNlKGluZGV4LCAwLCBjb250cm9sKTtcbiAgICAgIHRoaXMuX3JlZ2lzdGVyQ29udHJvbChjb250cm9sKTtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKTtcbiAgICB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMZW5ndGggb2YgdGhlIGNvbnRyb2wgYXJyYXkuXG4gICAqL1xuICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7IHJldHVybiB0aGlzLmNvbnRyb2xzLmxlbmd0aDsgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiB0aGUgYEZvcm1BcnJheWAuIEl0IGFjY2VwdHMgYW4gYXJyYXkgdGhhdCBtYXRjaGVzXG4gICAqIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIGNvbnRyb2wuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIHBlcmZvcm1zIHN0cmljdCBjaGVja3MsIGFuZCB0aHJvd3MgYW4gZXJyb3IgaWYgeW91IHRyeVxuICAgKiB0byBzZXQgdGhlIHZhbHVlIG9mIGEgY29udHJvbCB0aGF0IGRvZXNuJ3QgZXhpc3Qgb3IgaWYgeW91IGV4Y2x1ZGUgdGhlXG4gICAqIHZhbHVlIG9mIGEgY29udHJvbC5cbiAgICpcbiAgICogIyMjIFNldCB0aGUgdmFsdWVzIGZvciB0aGUgY29udHJvbHMgaW4gdGhlIGZvcm0gYXJyYXlcbiAgICpcbiAgICogYGBgXG4gICAqIGNvbnN0IGFyciA9IG5ldyBGb3JtQXJyYXkoW1xuICAgKiAgIG5ldyBGb3JtQ29udHJvbCgpLFxuICAgKiAgIG5ldyBGb3JtQ29udHJvbCgpXG4gICAqIF0pO1xuICAgKiBjb25zb2xlLmxvZyhhcnIudmFsdWUpOyAgIC8vIFtudWxsLCBudWxsXVxuICAgKlxuICAgKiBhcnIuc2V0VmFsdWUoWydOYW5jeScsICdEcmV3J10pO1xuICAgKiBjb25zb2xlLmxvZyhhcnIudmFsdWUpOyAgIC8vIFsnTmFuY3knLCAnRHJldyddXG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgQXJyYXkgb2YgdmFsdWVzIGZvciB0aGUgY29udHJvbHNcbiAgICogQHBhcmFtIG9wdGlvbnMgQ29uZmlndXJlIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlcyBhbmRcbiAgICogZW1pdHMgZXZlbnRzIGFmdGVyIHRoZSB2YWx1ZSBjaGFuZ2VzXG4gICAqXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBlYWNoIGNoYW5nZSBvbmx5IGFmZmVjdHMgdGhpcyBjb250cm9sLCBhbmQgbm90IGl0cyBwYXJlbnQuIERlZmF1bHRcbiAgICogaXMgZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIHZhbHVlIGlzIHVwZGF0ZWQuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICogVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBhcmUgcGFzc2VkIHRvIHRoZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sI3VwZGF0ZVZhbHVlQW5kVmFsaWRpdHlcbiAgICogdXBkYXRlVmFsdWVBbmRWYWxpZGl0eX0gbWV0aG9kLlxuICAgKi9cbiAgc2V0VmFsdWUodmFsdWU6IGFueVtdLCBvcHRpb25zOiB7b25seVNlbGY/OiBib29sZWFuLCBlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgdGhpcy5fY2hlY2tBbGxWYWx1ZXNQcmVzZW50KHZhbHVlKTtcbiAgICB2YWx1ZS5mb3JFYWNoKChuZXdWYWx1ZTogYW55LCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICB0aGlzLl90aHJvd0lmQ29udHJvbE1pc3NpbmcoaW5kZXgpO1xuICAgICAgdGhpcy5hdChpbmRleCkuc2V0VmFsdWUobmV3VmFsdWUsIHtvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBvcHRpb25zLmVtaXRFdmVudH0pO1xuICAgIH0pO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXRjaGVzIHRoZSB2YWx1ZSBvZiB0aGUgYEZvcm1BcnJheWAuIEl0IGFjY2VwdHMgYW4gYXJyYXkgdGhhdCBtYXRjaGVzIHRoZVxuICAgKiBzdHJ1Y3R1cmUgb2YgdGhlIGNvbnRyb2wsIGFuZCBkb2VzIGl0cyBiZXN0IHRvIG1hdGNoIHRoZSB2YWx1ZXMgdG8gdGhlIGNvcnJlY3RcbiAgICogY29udHJvbHMgaW4gdGhlIGdyb3VwLlxuICAgKlxuICAgKiBJdCBhY2NlcHRzIGJvdGggc3VwZXItc2V0cyBhbmQgc3ViLXNldHMgb2YgdGhlIGFycmF5IHdpdGhvdXQgdGhyb3dpbmcgYW4gZXJyb3IuXG4gICAqXG4gICAqICMjIyBQYXRjaCB0aGUgdmFsdWVzIGZvciBjb250cm9scyBpbiBhIGZvcm0gYXJyYXlcbiAgICpcbiAgICogYGBgXG4gICAqIGNvbnN0IGFyciA9IG5ldyBGb3JtQXJyYXkoW1xuICAgKiAgICBuZXcgRm9ybUNvbnRyb2woKSxcbiAgICogICAgbmV3IEZvcm1Db250cm9sKClcbiAgICogXSk7XG4gICAqIGNvbnNvbGUubG9nKGFyci52YWx1ZSk7ICAgLy8gW251bGwsIG51bGxdXG4gICAqXG4gICAqIGFyci5wYXRjaFZhbHVlKFsnTmFuY3knXSk7XG4gICAqIGNvbnNvbGUubG9nKGFyci52YWx1ZSk7ICAgLy8gWydOYW5jeScsIG51bGxdXG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgQXJyYXkgb2YgbGF0ZXN0IHZhbHVlcyBmb3IgdGhlIGNvbnRyb2xzXG4gICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyZSBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXMgYW5kXG4gICAqIGVtaXRzIGV2ZW50cyBhZnRlciB0aGUgdmFsdWUgY2hhbmdlc1xuICAgKlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgZWFjaCBjaGFuZ2Ugb25seSBhZmZlY3RzIHRoaXMgY29udHJvbCwgYW5kIG5vdCBpdHMgcGFyZW50LiBEZWZhdWx0XG4gICAqIGlzIGZhbHNlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2BcbiAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCB2YWx1ZSBpcyB1cGRhdGVkLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqIFRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgYXJlIHBhc3NlZCB0byB0aGUge0BsaW5rIEFic3RyYWN0Q29udHJvbCN1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5XG4gICAqIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHl9IG1ldGhvZC5cbiAgICovXG4gIHBhdGNoVmFsdWUodmFsdWU6IGFueVtdLCBvcHRpb25zOiB7b25seVNlbGY/OiBib29sZWFuLCBlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgdmFsdWUuZm9yRWFjaCgobmV3VmFsdWU6IGFueSwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgaWYgKHRoaXMuYXQoaW5kZXgpKSB7XG4gICAgICAgIHRoaXMuYXQoaW5kZXgpLnBhdGNoVmFsdWUobmV3VmFsdWUsIHtvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBvcHRpb25zLmVtaXRFdmVudH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIGBGb3JtQXJyYXlgIGFuZCBhbGwgZGVzY2VuZGFudHMgYXJlIG1hcmtlZCBgcHJpc3RpbmVgIGFuZCBgdW50b3VjaGVkYCwgYW5kIHRoZVxuICAgKiB2YWx1ZSBvZiBhbGwgZGVzY2VuZGFudHMgdG8gbnVsbCBvciBudWxsIG1hcHMuXG4gICAqXG4gICAqIFlvdSByZXNldCB0byBhIHNwZWNpZmljIGZvcm0gc3RhdGUgYnkgcGFzc2luZyBpbiBhbiBhcnJheSBvZiBzdGF0ZXNcbiAgICogdGhhdCBtYXRjaGVzIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIGNvbnRyb2wuIFRoZSBzdGF0ZSBpcyBhIHN0YW5kYWxvbmUgdmFsdWVcbiAgICogb3IgYSBmb3JtIHN0YXRlIG9iamVjdCB3aXRoIGJvdGggYSB2YWx1ZSBhbmQgYSBkaXNhYmxlZCBzdGF0dXMuXG4gICAqXG4gICAqICMjIyBSZXNldCB0aGUgdmFsdWVzIGluIGEgZm9ybSBhcnJheVxuICAgKlxuICAgKiBgYGB0c1xuICAgKiBjb25zdCBhcnIgPSBuZXcgRm9ybUFycmF5KFtcbiAgICogICAgbmV3IEZvcm1Db250cm9sKCksXG4gICAqICAgIG5ldyBGb3JtQ29udHJvbCgpXG4gICAqIF0pO1xuICAgKiBhcnIucmVzZXQoWyduYW1lJywgJ2xhc3QgbmFtZSddKTtcbiAgICpcbiAgICogY29uc29sZS5sb2codGhpcy5hcnIudmFsdWUpOyAgLy8gWyduYW1lJywgJ2xhc3QgbmFtZSddXG4gICAqIGBgYFxuICAgKlxuICAgKiAjIyMgUmVzZXQgdGhlIHZhbHVlcyBpbiBhIGZvcm0gYXJyYXkgYW5kIHRoZSBkaXNhYmxlZCBzdGF0dXMgZm9yIHRoZSBmaXJzdCBjb250cm9sXG4gICAqXG4gICAqIGBgYFxuICAgKiB0aGlzLmFyci5yZXNldChbXG4gICAqICAge3ZhbHVlOiAnbmFtZScsIGRpc2FibGVkOiB0cnVlfSxcbiAgICogICAnbGFzdCdcbiAgICogXSk7XG4gICAqXG4gICAqIGNvbnNvbGUubG9nKHRoaXMuYXJyLnZhbHVlKTsgIC8vIFsnbmFtZScsICdsYXN0IG5hbWUnXVxuICAgKiBjb25zb2xlLmxvZyh0aGlzLmFyci5nZXQoMCkuc3RhdHVzKTsgIC8vICdESVNBQkxFRCdcbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBBcnJheSBvZiB2YWx1ZXMgZm9yIHRoZSBjb250cm9sc1xuICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmUgb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzIGFuZFxuICAgKiBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIHZhbHVlIGNoYW5nZXNcbiAgICpcbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIGVhY2ggY2hhbmdlIG9ubHkgYWZmZWN0cyB0aGlzIGNvbnRyb2wsIGFuZCBub3QgaXRzIHBhcmVudC4gRGVmYXVsdFxuICAgKiBpcyBmYWxzZS5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgXG4gICAqIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXMgcmVzZXQuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICogVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBhcmUgcGFzc2VkIHRvIHRoZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sI3VwZGF0ZVZhbHVlQW5kVmFsaWRpdHlcbiAgICogdXBkYXRlVmFsdWVBbmRWYWxpZGl0eX0gbWV0aG9kLlxuICAgKi9cbiAgcmVzZXQodmFsdWU6IGFueSA9IFtdLCBvcHRpb25zOiB7b25seVNlbGY/OiBib29sZWFuLCBlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIGNvbnRyb2wucmVzZXQodmFsdWVbaW5kZXhdLCB7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnR9KTtcbiAgICB9KTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0aW9ucyk7XG4gICAgdGhpcy5fdXBkYXRlUHJpc3RpbmUob3B0aW9ucyk7XG4gICAgdGhpcy5fdXBkYXRlVG91Y2hlZChvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYWdncmVnYXRlIHZhbHVlIG9mIHRoZSBhcnJheSwgaW5jbHVkaW5nIGFueSBkaXNhYmxlZCBjb250cm9scy5cbiAgICpcbiAgICogUmVwb3J0cyBhbGwgdmFsdWVzIHJlZ2FyZGxlc3Mgb2YgZGlzYWJsZWQgc3RhdHVzLlxuICAgKiBGb3IgZW5hYmxlZCBjb250cm9scyBvbmx5LCB0aGUgYHZhbHVlYCBwcm9wZXJ0eSBpcyB0aGUgYmVzdCB3YXkgdG8gZ2V0IHRoZSB2YWx1ZSBvZiB0aGUgYXJyYXkuXG4gICAqL1xuICBnZXRSYXdWYWx1ZSgpOiBhbnlbXSB7XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbHMubWFwKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IHtcbiAgICAgIHJldHVybiBjb250cm9sIGluc3RhbmNlb2YgRm9ybUNvbnRyb2wgPyBjb250cm9sLnZhbHVlIDogKDxhbnk+Y29udHJvbCkuZ2V0UmF3VmFsdWUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3N5bmNQZW5kaW5nQ29udHJvbHMoKTogYm9vbGVhbiB7XG4gICAgbGV0IHN1YnRyZWVVcGRhdGVkID0gdGhpcy5jb250cm9scy5yZWR1Y2UoKHVwZGF0ZWQ6IGJvb2xlYW4sIGNoaWxkOiBBYnN0cmFjdENvbnRyb2wpID0+IHtcbiAgICAgIHJldHVybiBjaGlsZC5fc3luY1BlbmRpbmdDb250cm9scygpID8gdHJ1ZSA6IHVwZGF0ZWQ7XG4gICAgfSwgZmFsc2UpO1xuICAgIGlmIChzdWJ0cmVlVXBkYXRlZCkgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtvbmx5U2VsZjogdHJ1ZX0pO1xuICAgIHJldHVybiBzdWJ0cmVlVXBkYXRlZDtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3Rocm93SWZDb250cm9sTWlzc2luZyhpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmNvbnRyb2xzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcbiAgICAgICAgVGhlcmUgYXJlIG5vIGZvcm0gY29udHJvbHMgcmVnaXN0ZXJlZCB3aXRoIHRoaXMgYXJyYXkgeWV0LiAgSWYgeW91J3JlIHVzaW5nIG5nTW9kZWwsXG4gICAgICAgIHlvdSBtYXkgd2FudCB0byBjaGVjayBuZXh0IHRpY2sgKGUuZy4gdXNlIHNldFRpbWVvdXQpLlxuICAgICAgYCk7XG4gICAgfVxuICAgIGlmICghdGhpcy5hdChpbmRleCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGZpbmQgZm9ybSBjb250cm9sIGF0IGluZGV4ICR7aW5kZXh9YCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfZm9yRWFjaENoaWxkKGNiOiBGdW5jdGlvbik6IHZvaWQge1xuICAgIHRoaXMuY29udHJvbHMuZm9yRWFjaCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbmRleDogbnVtYmVyKSA9PiB7IGNiKGNvbnRyb2wsIGluZGV4KTsgfSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVWYWx1ZSgpOiB2b2lkIHtcbiAgICAodGhpcyBhc3t2YWx1ZTogYW55fSkudmFsdWUgPVxuICAgICAgICB0aGlzLmNvbnRyb2xzLmZpbHRlcigoY29udHJvbCkgPT4gY29udHJvbC5lbmFibGVkIHx8IHRoaXMuZGlzYWJsZWQpXG4gICAgICAgICAgICAubWFwKChjb250cm9sKSA9PiBjb250cm9sLnZhbHVlKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2FueUNvbnRyb2xzKGNvbmRpdGlvbjogRnVuY3Rpb24pOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jb250cm9scy5zb21lKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IGNvbnRyb2wuZW5hYmxlZCAmJiBjb25kaXRpb24oY29udHJvbCkpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc2V0VXBDb250cm9scygpOiB2b2lkIHtcbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4gdGhpcy5fcmVnaXN0ZXJDb250cm9sKGNvbnRyb2wpKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NoZWNrQWxsVmFsdWVzUHJlc2VudCh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIGk6IG51bWJlcikgPT4ge1xuICAgICAgaWYgKHZhbHVlW2ldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBNdXN0IHN1cHBseSBhIHZhbHVlIGZvciBmb3JtIGNvbnRyb2wgYXQgaW5kZXg6ICR7aX0uYCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9hbGxDb250cm9sc0Rpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIGZvciAoY29uc3QgY29udHJvbCBvZiB0aGlzLmNvbnRyb2xzKSB7XG4gICAgICBpZiAoY29udHJvbC5lbmFibGVkKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbnRyb2xzLmxlbmd0aCA+IDAgfHwgdGhpcy5kaXNhYmxlZDtcbiAgfVxuXG4gIHByaXZhdGUgX3JlZ2lzdGVyQ29udHJvbChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpIHtcbiAgICBjb250cm9sLnNldFBhcmVudCh0aGlzKTtcbiAgICBjb250cm9sLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSh0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UpO1xuICB9XG59XG4iXX0=