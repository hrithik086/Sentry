using AutoMapper;
using Entities = Sentry.Core.Service.Repository.NoSqlDb.Models;
using DTO = Sentry.Core.Service.Models.RequestDTO;

namespace Sentry.Core.Service.Helper.AutoMapper;

public class SentryMappingProfile : Profile
{
    public SentryMappingProfile()
    {
        CreateMap<DTO.Credential, Entities.Credential>().ReverseMap();
    }
}