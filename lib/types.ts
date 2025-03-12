export interface Product {
  id: string
  name: string
  description: string
  price: number
  discount: number
  rating: number
  image: string
  colors: string[]
  sizes: string[]
  isNew?: boolean
  category: string
}

