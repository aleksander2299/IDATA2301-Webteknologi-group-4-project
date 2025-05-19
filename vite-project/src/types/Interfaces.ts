export interface RoomDetails{
    roomId: number;
    roomName: string;
    description: string;
    roomType: string;
    imageUrl: string;
}

export interface Source{
   sourceId: number;
   sourceName:  string;
   locationType: string;
   city:  string;
   country: string;
}

export interface RoomProvider {
    roomProviderId: number;
    roomPrice: number;
    provider: {
      providerId: number;
      providerName: string;
    };
  }

  export interface ExtraFeatures{
    feature: string;
  }

  export interface Booking {
    checkInDate: string; 
    checkOutDate: string; 
  }