import * as tslib_1 from "tslib";
import * as i0 from "@angular/core";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Self } from '@angular/core';
import { ControlContainer } from './control_container';
import { NgControl } from './ng_control';
var AbstractControlStatus = /** @class */ (function () {
    function AbstractControlStatus(cd) {
        this._cd = cd;
    }
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassUntouched", {
        get: function () { return this._cd.control ? this._cd.control.untouched : false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassTouched", {
        get: function () { return this._cd.control ? this._cd.control.touched : false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassPristine", {
        get: function () { return this._cd.control ? this._cd.control.pristine : false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassDirty", {
        get: function () { return this._cd.control ? this._cd.control.dirty : false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassValid", {
        get: function () { return this._cd.control ? this._cd.control.valid : false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassInvalid", {
        get: function () { return this._cd.control ? this._cd.control.invalid : false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassPending", {
        get: function () { return this._cd.control ? this._cd.control.pending : false; },
        enumerable: true,
        configurable: true
    });
    return AbstractControlStatus;
}());
export { AbstractControlStatus };
export var ngControlStatusHost = {
    '[class.ng-untouched]': 'ngClassUntouched',
    '[class.ng-touched]': 'ngClassTouched',
    '[class.ng-pristine]': 'ngClassPristine',
    '[class.ng-dirty]': 'ngClassDirty',
    '[class.ng-valid]': 'ngClassValid',
    '[class.ng-invalid]': 'ngClassInvalid',
    '[class.ng-pending]': 'ngClassPending',
};
/**
 * Directive automatically applied to Angular form controls that sets CSS classes
 * based on control status. The following classes are applied as the properties
 * become true:
 *
 * * ng-valid
 * * ng-invalid
 * * ng-pending
 * * ng-pristine
 * * ng-dirty
 * * ng-untouched
 * * ng-touched
 *
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 */
var NgControlStatus = /** @class */ (function (_super) {
    tslib_1.__extends(NgControlStatus, _super);
    function NgControlStatus(cd) {
        return _super.call(this, cd) || this;
    }
    NgControlStatus.ngDirectiveDef = i0.ɵdefineDirective({ type: NgControlStatus, selectors: [["", "formControlName", ""], ["", "ngModel", ""], ["", "formControl", ""]], factory: function NgControlStatus_Factory() { return new NgControlStatus(i0.ɵdirectiveInject(NgControl, 2)); }, hostBindings: function NgControlStatus_HostBindings(dirIndex, elIndex) { i0.ɵp(elIndex, "class.ng-untouched", i0.ɵb(i0.ɵd(dirIndex).ngClassUntouched)); i0.ɵp(elIndex, "class.ng-touched", i0.ɵb(i0.ɵd(dirIndex).ngClassTouched)); i0.ɵp(elIndex, "class.ng-pristine", i0.ɵb(i0.ɵd(dirIndex).ngClassPristine)); i0.ɵp(elIndex, "class.ng-dirty", i0.ɵb(i0.ɵd(dirIndex).ngClassDirty)); i0.ɵp(elIndex, "class.ng-valid", i0.ɵb(i0.ɵd(dirIndex).ngClassValid)); i0.ɵp(elIndex, "class.ng-invalid", i0.ɵb(i0.ɵd(dirIndex).ngClassInvalid)); i0.ɵp(elIndex, "class.ng-pending", i0.ɵb(i0.ɵd(dirIndex).ngClassPending)); }, features: [i0.ɵInheritDefinitionFeature] });
    return NgControlStatus;
}(AbstractControlStatus));
export { NgControlStatus };
/**
 * Directive automatically applied to Angular form groups that sets CSS classes
 * based on control status (valid/invalid/dirty/etc).
 *
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 */
var NgControlStatusGroup = /** @class */ (function (_super) {
    tslib_1.__extends(NgControlStatusGroup, _super);
    function NgControlStatusGroup(cd) {
        return _super.call(this, cd) || this;
    }
    NgControlStatusGroup.ngDirectiveDef = i0.ɵdefineDirective({ type: NgControlStatusGroup, selectors: [["", "formGroupName", ""], ["", "formArrayName", ""], ["", "ngModelGroup", ""], ["", "formGroup", ""], ["form", 3, "ngNoForm", ""], ["", "ngForm", ""]], factory: function NgControlStatusGroup_Factory() { return new NgControlStatusGroup(i0.ɵdirectiveInject(ControlContainer, 2)); }, hostBindings: function NgControlStatusGroup_HostBindings(dirIndex, elIndex) { i0.ɵp(elIndex, "class.ng-untouched", i0.ɵb(i0.ɵd(dirIndex).ngClassUntouched)); i0.ɵp(elIndex, "class.ng-touched", i0.ɵb(i0.ɵd(dirIndex).ngClassTouched)); i0.ɵp(elIndex, "class.ng-pristine", i0.ɵb(i0.ɵd(dirIndex).ngClassPristine)); i0.ɵp(elIndex, "class.ng-dirty", i0.ɵb(i0.ɵd(dirIndex).ngClassDirty)); i0.ɵp(elIndex, "class.ng-valid", i0.ɵb(i0.ɵd(dirIndex).ngClassValid)); i0.ɵp(elIndex, "class.ng-invalid", i0.ɵb(i0.ɵd(dirIndex).ngClassInvalid)); i0.ɵp(elIndex, "class.ng-pending", i0.ɵb(i0.ɵd(dirIndex).ngClassPending)); }, features: [i0.ɵInheritDefinitionFeature] });
    return NgControlStatusGroup;
}(AbstractControlStatus));
export { NgControlStatusGroup };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfY29udHJvbF9zdGF0dXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9uZ19jb250cm9sX3N0YXR1cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsSUFBSSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRzlDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3JELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFFdkM7SUFHRSwrQkFBWSxFQUE0QjtRQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQUMsQ0FBQztJQUU1RCxzQkFBSSxtREFBZ0I7YUFBcEIsY0FBa0MsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUNqRyxzQkFBSSxpREFBYzthQUFsQixjQUFnQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQzdGLHNCQUFJLGtEQUFlO2FBQW5CLGNBQWlDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDL0Ysc0JBQUksK0NBQVk7YUFBaEIsY0FBOEIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUN6RixzQkFBSSwrQ0FBWTthQUFoQixjQUE4QixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQ3pGLHNCQUFJLGlEQUFjO2FBQWxCLGNBQWdDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDN0Ysc0JBQUksaURBQWM7YUFBbEIsY0FBZ0MsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUMvRiw0QkFBQztBQUFELENBQUMsQUFaRCxJQVlDOztBQUVELE1BQU0sQ0FBQyxJQUFNLG1CQUFtQixHQUFHO0lBQ2pDLHNCQUFzQixFQUFFLGtCQUFrQjtJQUMxQyxvQkFBb0IsRUFBRSxnQkFBZ0I7SUFDdEMscUJBQXFCLEVBQUUsaUJBQWlCO0lBQ3hDLGtCQUFrQixFQUFFLGNBQWM7SUFDbEMsa0JBQWtCLEVBQUUsY0FBYztJQUNsQyxvQkFBb0IsRUFBRSxnQkFBZ0I7SUFDdEMsb0JBQW9CLEVBQUUsZ0JBQWdCO0NBQ3ZDLENBQUM7QUFFRjs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSDtJQUNxQywyQ0FBcUI7SUFDeEQseUJBQW9CLEVBQWE7ZUFBSSxrQkFBTSxFQUFFLENBQUM7SUFBRSxDQUFDO2lFQUR0QyxlQUFlLG1KQUFmLGVBQWUscUJBQ0YsU0FBUzswQkF4RG5DO0NBeURDLEFBSEQsQ0FDcUMscUJBQXFCLEdBRXpEO1NBRlksZUFBZTtBQUk1Qjs7Ozs7O0dBTUc7QUFDSDtJQUswQyxnREFBcUI7SUFDN0QsOEJBQW9CLEVBQW9CO2VBQUksa0JBQU0sRUFBRSxDQUFDO0lBQUUsQ0FBQztzRUFEN0Msb0JBQW9CLHFPQUFwQixvQkFBb0IscUJBQ1AsZ0JBQWdCOytCQXhFMUM7Q0F5RUMsQUFQRCxDQUswQyxxQkFBcUIsR0FFOUQ7U0FGWSxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBTZWxmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtBYnN0cmFjdENvbnRyb2xEaXJlY3RpdmV9IGZyb20gJy4vYWJzdHJhY3RfY29udHJvbF9kaXJlY3RpdmUnO1xuaW1wb3J0IHtDb250cm9sQ29udGFpbmVyfSBmcm9tICcuL2NvbnRyb2xfY29udGFpbmVyJztcbmltcG9ydCB7TmdDb250cm9sfSBmcm9tICcuL25nX2NvbnRyb2wnO1xuXG5leHBvcnQgY2xhc3MgQWJzdHJhY3RDb250cm9sU3RhdHVzIHtcbiAgcHJpdmF0ZSBfY2Q6IEFic3RyYWN0Q29udHJvbERpcmVjdGl2ZTtcblxuICBjb25zdHJ1Y3RvcihjZDogQWJzdHJhY3RDb250cm9sRGlyZWN0aXZlKSB7IHRoaXMuX2NkID0gY2Q7IH1cblxuICBnZXQgbmdDbGFzc1VudG91Y2hlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2NkLmNvbnRyb2wgPyB0aGlzLl9jZC5jb250cm9sLnVudG91Y2hlZCA6IGZhbHNlOyB9XG4gIGdldCBuZ0NsYXNzVG91Y2hlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2NkLmNvbnRyb2wgPyB0aGlzLl9jZC5jb250cm9sLnRvdWNoZWQgOiBmYWxzZTsgfVxuICBnZXQgbmdDbGFzc1ByaXN0aW5lKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fY2QuY29udHJvbCA/IHRoaXMuX2NkLmNvbnRyb2wucHJpc3RpbmUgOiBmYWxzZTsgfVxuICBnZXQgbmdDbGFzc0RpcnR5KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fY2QuY29udHJvbCA/IHRoaXMuX2NkLmNvbnRyb2wuZGlydHkgOiBmYWxzZTsgfVxuICBnZXQgbmdDbGFzc1ZhbGlkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fY2QuY29udHJvbCA/IHRoaXMuX2NkLmNvbnRyb2wudmFsaWQgOiBmYWxzZTsgfVxuICBnZXQgbmdDbGFzc0ludmFsaWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9jZC5jb250cm9sID8gdGhpcy5fY2QuY29udHJvbC5pbnZhbGlkIDogZmFsc2U7IH1cbiAgZ2V0IG5nQ2xhc3NQZW5kaW5nKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fY2QuY29udHJvbCA/IHRoaXMuX2NkLmNvbnRyb2wucGVuZGluZyA6IGZhbHNlOyB9XG59XG5cbmV4cG9ydCBjb25zdCBuZ0NvbnRyb2xTdGF0dXNIb3N0ID0ge1xuICAnW2NsYXNzLm5nLXVudG91Y2hlZF0nOiAnbmdDbGFzc1VudG91Y2hlZCcsXG4gICdbY2xhc3MubmctdG91Y2hlZF0nOiAnbmdDbGFzc1RvdWNoZWQnLFxuICAnW2NsYXNzLm5nLXByaXN0aW5lXSc6ICduZ0NsYXNzUHJpc3RpbmUnLFxuICAnW2NsYXNzLm5nLWRpcnR5XSc6ICduZ0NsYXNzRGlydHknLFxuICAnW2NsYXNzLm5nLXZhbGlkXSc6ICduZ0NsYXNzVmFsaWQnLFxuICAnW2NsYXNzLm5nLWludmFsaWRdJzogJ25nQ2xhc3NJbnZhbGlkJyxcbiAgJ1tjbGFzcy5uZy1wZW5kaW5nXSc6ICduZ0NsYXNzUGVuZGluZycsXG59O1xuXG4vKipcbiAqIERpcmVjdGl2ZSBhdXRvbWF0aWNhbGx5IGFwcGxpZWQgdG8gQW5ndWxhciBmb3JtIGNvbnRyb2xzIHRoYXQgc2V0cyBDU1MgY2xhc3Nlc1xuICogYmFzZWQgb24gY29udHJvbCBzdGF0dXMuIFRoZSBmb2xsb3dpbmcgY2xhc3NlcyBhcmUgYXBwbGllZCBhcyB0aGUgcHJvcGVydGllc1xuICogYmVjb21lIHRydWU6XG4gKlxuICogKiBuZy12YWxpZFxuICogKiBuZy1pbnZhbGlkXG4gKiAqIG5nLXBlbmRpbmdcbiAqICogbmctcHJpc3RpbmVcbiAqICogbmctZGlydHlcbiAqICogbmctdW50b3VjaGVkXG4gKiAqIG5nLXRvdWNoZWRcbiAqXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnW2Zvcm1Db250cm9sTmFtZV0sW25nTW9kZWxdLFtmb3JtQ29udHJvbF0nLCBob3N0OiBuZ0NvbnRyb2xTdGF0dXNIb3N0fSlcbmV4cG9ydCBjbGFzcyBOZ0NvbnRyb2xTdGF0dXMgZXh0ZW5kcyBBYnN0cmFjdENvbnRyb2xTdGF0dXMge1xuICBjb25zdHJ1Y3RvcihAU2VsZigpIGNkOiBOZ0NvbnRyb2wpIHsgc3VwZXIoY2QpOyB9XG59XG5cbi8qKlxuICogRGlyZWN0aXZlIGF1dG9tYXRpY2FsbHkgYXBwbGllZCB0byBBbmd1bGFyIGZvcm0gZ3JvdXBzIHRoYXQgc2V0cyBDU1MgY2xhc3Nlc1xuICogYmFzZWQgb24gY29udHJvbCBzdGF0dXMgKHZhbGlkL2ludmFsaWQvZGlydHkvZXRjKS5cbiAqXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjpcbiAgICAgICdbZm9ybUdyb3VwTmFtZV0sW2Zvcm1BcnJheU5hbWVdLFtuZ01vZGVsR3JvdXBdLFtmb3JtR3JvdXBdLGZvcm06bm90KFtuZ05vRm9ybV0pLFtuZ0Zvcm1dJyxcbiAgaG9zdDogbmdDb250cm9sU3RhdHVzSG9zdFxufSlcbmV4cG9ydCBjbGFzcyBOZ0NvbnRyb2xTdGF0dXNHcm91cCBleHRlbmRzIEFic3RyYWN0Q29udHJvbFN0YXR1cyB7XG4gIGNvbnN0cnVjdG9yKEBTZWxmKCkgY2Q6IENvbnRyb2xDb250YWluZXIpIHsgc3VwZXIoY2QpOyB9XG59XG4iXX0=