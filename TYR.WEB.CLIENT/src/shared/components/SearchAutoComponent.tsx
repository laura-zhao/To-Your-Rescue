// import { Spin } from 'antd';
import { apiCall } from '../api/apiWrapper';

// eslint-disable-next-line
const SearchAutoComponent = (searchText: string, api: any) => {
  const mockData: any = [];
  const data = {};
  apiCall(`PCO/search-autocomplete?searchText=${searchText}`, 'GET', data)
    .then((resp: any) => {
      if (resp?.data?.success) {
        resp.data?.data?.map((datas:any) => (
          mockData.push({ value: datas?.lastName })
        ));
      }
      console.log(mockData, 'mockDatamockData');
      return mockData;
    });
};
export default SearchAutoComponent;
