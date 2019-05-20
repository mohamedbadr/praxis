using Praxis.Data;

namespace Praxis.Service
{
    public class ServiceBase
    {
        private readonly IDataContextFactory _dataContextFactory;

        public IDataContext DataContext()
        {
            return _dataContextFactory.GetContext();
        }

        public ServiceBase(IDataContextFactory dataContextFactory)
        {
            _dataContextFactory = dataContextFactory;
        }
    }
}
