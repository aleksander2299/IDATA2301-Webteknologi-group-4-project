import {Provider} from "./Provider.ts";
import {Room} from "./Room.ts";

export type RoomProvider = {
    roomProviderId: number;
    provider: Provider;
    room: Room;
    roomPrice: number;
}