import { apiClient } from '@/utils/requests';

class PassportService {
   async test(): Promise<any> {
      const { data: response } = await apiClient.get(`/test`);
      return response;
   }

   async images(): Promise<any> {
      return await fetch('http://localhost:5000/images', {
         mode: 'cors',
         headers: {
            'Access-Control-Allow-Origin': '*',
            Accept: 'multipart/form-data',
         },
      });
   }

   // async images(): Promise<any> {
   //    return await apiClient.get(`/images`, {
   //       responseType: 'blob',
   //       headers: {
   //          'Content-Type': 'multipart/form-data',
   //       },
   //    });
   // }

   async requestSearchData(search: string, location: string): Promise<any> {
      const { data: response } = await apiClient.get(`/search`, { params: { search, location } });
      return response;
   }

   async uploadImage(id: any, data: any): Promise<any> {
      const { data: response } = await apiClient.post(`/upload`, data, {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      });
      return response;
   }
}

export default new PassportService();
