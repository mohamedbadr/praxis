using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Praxis.Api.ErrorHandling;
using Praxis.Data;
using System.Linq;
using System.Security.Claims;

namespace Praxis.Api.Controllers
{
    public class BaseController : ControllerBase
    {
        protected readonly IDataContextFactory DataContextFactory;

        public BaseController(IDataContextFactory dataContextFactory)
        {
            DataContextFactory = dataContextFactory;
        }

        public int UserId
        {
            get { return int.Parse(HttpContext.User.Claims.First(i => i.Type == ClaimTypes.NameIdentifier).Value); }
        }

        [Route("model-state-error")]
        protected IActionResult ModelStateError(ModelStateDictionary modelState)
        {
            var apiError = new ApiError
            {
                Type = ApiErrorType.ModelStateError,
                Message = "Model state is invalid.",
                Metadata = new
                {
                    fields = modelState.Keys.ToArray()
                }
            };

            return BadRequest(apiError);
        }

        [Route("invalid-argument-error")]
        protected IActionResult InvalidArgumentError(string message)
        {
            var apiError = new ApiError
            {
                Type = ApiErrorType.ArgumentsError,
                Message = message,
                Metadata = new
                {
                    message
                }
            };

            return BadRequest(apiError);
        }
    }
}