using AutoMapper;
using CybersecurityPortal.API.Models;
using CybersecurityPortal.API.Models.Dtos;

namespace CybersecurityPortal.API.Infrastructure.Mapping
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<Category, CategoryDto>().ReverseMap();

            CreateMap<Article, ArticleDto>().ReverseMap();
            CreateMap<CreateArticleDto, Article>();
        }
    }
}
