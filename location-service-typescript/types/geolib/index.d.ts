/** Finds the nearest coordinate to a reference coordinate. */
declare namespace geolib {
    function findNearest(latlng: PositionAsDecimal | PositionAsSexadecimal,
                         coords: PositionAsDecimal[] | { [x: string]: PositionAsDecimal },
                         offset?: number,
                         limit?: number): Distance[] | Distance;
}