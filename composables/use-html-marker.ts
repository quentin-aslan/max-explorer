// Define the interface for the arguments
interface HTMLMapMarkerArgs {
  latlng: google.maps.LatLng
  html: string
  map: google.maps.Map
  OverlayView?: typeof google.maps.OverlayView
}

export type HTMLMapMarker = google.maps.OverlayView & {
  latlng: google.maps.LatLng
  html: string
  div: HTMLDivElement | null
  createDiv(): void
  updateDivHtml(html: string): void
  appendDivToOverlay(): void
  positionDiv(): void
  draw(): void
  remove(): void
  getPosition(): google.maps.LatLng
  getDraggable(): boolean
}

export const useHtmlMarker = () => {
  const createHTMLMapMarker = ({
    OverlayView = google.maps.OverlayView,
    ...args
  }: HTMLMapMarkerArgs): HTMLMapMarker => {
    class HTMLMapMarker extends OverlayView {
      latlng: google.maps.LatLng
      html: string
      div: HTMLDivElement | null

      constructor() {
        super()
        this.latlng = args.latlng
        this.html = args.html
        this.div = null
        this.setMap(args.map)
      }

      createDiv() {
        this.div = document.createElement('div')
        this.div.style.position = 'absolute'
        this.updateDivHtml(this.html)

        google.maps.event.addDomListener(this.div, 'click', () => {
          google.maps.event.trigger(this, 'click')
        })

        google.maps.event.addDomListener(this.div, 'mouseover', () => {
          google.maps.event.trigger(this, 'mouseover')
        })
      }

      updateDivHtml(html: string) {
        if (this.div) {
          this.div.innerHTML = html
        }
      }

      appendDivToOverlay() {
        const panes = this.getPanes()
        panes?.overlayLayer.appendChild(this.div!)
      }

      positionDiv() {
        const point = this.getProjection().fromLatLngToDivPixel(this.latlng)
        if (point) {
          this.div!.style.left = `${point.x}px`
          this.div!.style.top = `${point.y}px`
        }
      }

      draw() {
        if (!this.div) {
          this.createDiv()
          this.appendDivToOverlay()
        }
        this.positionDiv()
      }

      remove() {
        if (this.div) {
          this.div.parentNode?.removeChild(this.div)
        }
      }

      getPosition() {
        return this.latlng
      }

      getDraggable() {
        return false
      }
    }

    return new HTMLMapMarker()
  }

  return {
    createHTMLMapMarker,
  }
}
