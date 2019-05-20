using Imgur.API.Authentication.Impl;
using Imgur.API.Endpoints.Impl;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Praxis.Api.Attributes;
using Praxis.Data;
using Praxis.Entities.Identity;
using Praxis.Entities.Product;
using Praxis.Service;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Praxis.Api.Controllers
{
    [Route("api/products")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    [AuthorizeRole(Role.Company)]
    public class ProductsController : BaseController
    {
        private readonly ProductService _productService;

        public ProductsController(
            IDataContextFactory dataContextFactory,
            ProductService productService) : base(dataContextFactory)
        {
            _productService = productService;
        }

        [HttpGet("company/{companyId}/page/{page:int}")]
        public async Task<IActionResult> GetProductsByCompany([FromRoute]string companyId, [FromRoute]int page)
        {
            var products = await _productService.GetProductsByCompany(companyId, page);
            return Ok(products);
        }

        [HttpGet("{productId:int}")]
        public async Task<IActionResult> GetProductById([FromRoute] int productId)
        {
            var product = await _productService.GetProductById(productId);
            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }

        [HttpPost("add")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> AddProduct()
        {
            var product = new Product
            {
                ProductName = Request.Form["productName"],
                CompanyId = Request.Form["companyId"],
                Price = Convert.ToDecimal(Request.Form["price"]),
                ProductCode = Request.Form["productCode"]
            };

            product = await _productService.AddProduct(product);

            if (Request.Form.Files != null && Request.Form.Files.ToList().Any())
            {
                var files = Request.Form.Files.ToList();
                foreach (var file in files)
                {
                    var filePath = await UploadFile(file, product.ProductId);
                    var image = new ProductImage
                    {
                        ProductId = product.ProductId,
                        Description = file.FileName,
                        ImageUrl = filePath
                    };

                    await _productService.AddProductImage(image);
                }
            }

            return Ok(true);
        }

        [HttpPost("{productId:int}/edit")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> EditProduct([FromRoute] int productId)
        {
            var product = await _productService.GetProductForEdit(productId);
            if (product == null)
            {
                return NotFound();
            }

            // update product
            product.ProductName = Request.Form["productName"];
            product.ProductCode = Request.Form["productCode"];
            product.Price = Convert.ToDecimal(Request.Form["price"]);
            await _productService.SaveProduct(product);

            // save new images if any
            if (Request.Form.Files != null && Request.Form.Files.ToList().Any())
            {
                var files = Request.Form.Files.ToList();
                foreach (var file in files)
                {
                    var filePath = await UploadFile(file, product.ProductId);
                    var image = new ProductImage
                    {
                        ProductId = product.ProductId,
                        Description = file.FileName,
                        ImageUrl = filePath
                    };

                    await _productService.AddProductImage(image);
                }
            }

            product = await _productService.GetProductById(productId);
            return Ok(product);
        }

        [HttpDelete("{productId:int}")]
        public async Task<IActionResult> DeleteProduct([FromRoute] int productId)
        {
            await _productService.DeleteProduct(productId);
            return Ok(true);
        }

        [HttpDelete("~/api/product-images/{imageId:int}")]
        public async Task<IActionResult> DeleteProductImage([FromRoute]int imageId)
        {
            await _productService.DeleteProductImage(imageId);
            return Ok(true);
        }

        private static async Task<string> UploadFile(IFormFile file, int productId)
        {
            const string clientId = "b6b6978e249571d";
            const string secret = "1be7229d4f3819aa4a726a7933db245ec1b0ad97";

            var client = new ImgurClient(clientId, secret);
            var endpoint = new ImageEndpoint(client);
            var image = await endpoint.UploadImageStreamAsync(file.OpenReadStream());

            return image.Link;
        }

    }
}