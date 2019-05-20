using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Praxis.Api.Controllers;
using System;

namespace Praxis.Web.Configuration
{
    public class FromBodyConvention : IActionModelConvention
    {
        public void Apply(ActionModel action)
        {
            if (action == null)
            {
                throw new ArgumentException(nameof(action));
            }

            var type = action.Controller.ControllerType;
            if (typeof(BaseController).IsAssignableFrom(type.BaseType))
            {
                foreach (var parameter in action.Parameters)
                {
                    if (parameter.BindingInfo == null)
                    {
                        parameter.BindingInfo = parameter.BindingInfo ?? new BindingInfo();
                        parameter.BindingInfo.BindingSource = BindingSource.Body;
                    }
                }
            }
        }
    }
}
