import React, { useState, useEffect } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const IndonesiaMap = ({ locations = [] }) => {
    const [markers, setMarkers] = useState(
        locations
            .filter((l) => l.lat !== undefined && l.lng !== undefined)
            .map((l) => ({ ...l }))
    );

    const [selectedMarker, setSelectedMarker] = useState(null);

    // Sync markers if locations prop changes
    useEffect(() => {
        setMarkers(
            locations
                .filter((l) => l.lat !== undefined && l.lng !== undefined)
                .map((l) => ({ ...l }))
        );
    }, [locations]);

    return (
        <div className="relative w-full h-96 bg-slate-50 rounded-xl overflow-hidden shadow-inner border border-slate-100">
            <Map
                mapLib={maplibregl}
                initialViewState={{ longitude: 118, latitude: -2, zoom: 4 }}
                mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                style={{ width: '100%', height: '100%' }}
            >
                <NavigationControl position="top-left" />
                {markers.map((m, idx) => (
                    <React.Fragment key={idx}>
                        <Marker
                            longitude={m.lng}
                            latitude={m.lat}
                            draggable
                            onClick={e => {
                                e.originalEvent.stopPropagation();
                                setSelectedMarker(m);
                            }}
                            onDragEnd={(e) => {
                                const { lngLat } = e;
                                setMarkers((prev) =>
                                    prev.map((p, i) =>
                                        i === idx ? { ...p, lng: lngLat.lng, lat: lngLat.lat } : p
                                    )
                                );
                            }}
                        >
                            <div className="relative cursor-pointer">
                                <div className={`absolute -inset-2 rounded-full opacity-30 animate-ping ${m.status === 'New' ? 'bg-blue-500' : 'bg-red-500'}`} />
                                <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-white shadow hover:scale-125 transition-transform ${m.status === 'New' ? 'bg-blue-600' : 'bg-red-600'}`} />
                            </div>
                        </Marker>
                        
                        {selectedMarker && selectedMarker.name === m.name && (
                            <Popup
                                longitude={m.lng}
                                latitude={m.lat}
                                anchor="bottom"
                                onClose={() => setSelectedMarker(null)}
                                closeButton={true}
                                closeOnClick={false}
                                offset={10}
                            >
                                <div className="p-1">
                                    <div className="font-bold text-gray-800">{m.name}</div>
                                    <div className="text-xs text-gray-600 mt-0.5">{m.value}</div>
                                    <div className={`text-[10px] font-medium mt-1 ${m.status === 'New' ? 'text-blue-500' : 'text-red-500'}`}>
                                        {m.status ? `${m.status} Outlet` : 'Distributor Location'}
                                    </div>
                                    <div className="text-[10px] text-gray-400 mt-0.5">
                                        {m.lat.toFixed(4)}, {m.lng.toFixed(4)}
                                    </div>
                                </div>
                            </Popup>
                        )}
                    </React.Fragment>
                ))}
            </Map>

            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-gray-100 text-xs text-gray-500 z-10">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-600"></span>
                        <span>Old Outlet</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        <span>New Outlet</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IndonesiaMap;
