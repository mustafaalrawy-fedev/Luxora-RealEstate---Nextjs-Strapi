import PropertiesContent from '@/components/properties/PropertiesContent'
import { MapFloatingButton } from '@/components/map/MapFloatingButton'
import { MapDisplay } from '@/components/map/MapDisplay'

const properties = () => {
  return (
    <>
      <PropertiesContent />
      <MapFloatingButton />
      <MapDisplay />
    </>
  )
}

export default properties