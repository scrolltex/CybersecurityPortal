using System.Linq;
using AutoMapper;
using CybersecurityPortal.API.Models;
using CybersecurityPortal.API.Models.Dtos;

namespace CybersecurityPortal.API.Infrastructure.Mapping
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<User, UserDto>();

            CreateMap<Category, CategoryDto>()
                .ReverseMap();

            string currentUserId = null!;
            CreateMap<Article, ArticleDto>()
                .ForMember(
                    x => x.Stats,
                    opt => opt.MapFrom(x => new ArticleStatsDto()
                    {
                        Likes = x.UserLikes.Count(b => b.ArticleId == x.Id)
                    }))
                .ForMember(
                    x => x.UserState,
                    opt => opt.MapFrom(x => new ArticleUserStateDto
                    {
                        UserLikes = x.UserLikes.Any(b => b.ArticleId == x.Id && b.UserId == currentUserId),
                        UserBookmark = x.UserBookmarks.Any(b => b.ArticleId == x.Id && b.UserId == currentUserId)
                    }))
                .ReverseMap();

            CreateMap<CreateArticleDto, Article>();
        }
    }
}
