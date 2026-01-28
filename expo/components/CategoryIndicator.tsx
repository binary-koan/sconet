import { MaterialCommunityIcons } from "@expo/vector-icons"
import { View } from "react-native"
import { CATEGORY_BACKGROUND_COLORS, CategoryColor } from "@/lib/categoryColors"
import { cn } from "@/lib/utils"

type IconName = keyof typeof MaterialCommunityIcons.glyphMap

// Map category icon names to MaterialCommunityIcons names
// This is a subset - expand as needed based on the icons used in the app
const iconMap: Record<string, IconName> = {
  Home: "home",
  Home2: "home",
  Car: "car",
  Bus: "bus",
  Train: "train",
  Plane: "airplane",
  ShoppingCart: "cart",
  Basket: "basket",
  CreditCard: "credit-card",
  Cash: "cash",
  Wallet: "wallet",
  Building: "office-building",
  BuildingBank: "bank",
  BuildingStore: "store",
  Coffee: "coffee",
  Beer: "beer",
  Pizza: "pizza",
  Apple: "apple",
  Bread: "bread-slice",
  Carrot: "carrot",
  Egg: "egg",
  Cheese: "cheese",
  Meat: "food-steak",
  Cookie: "cookie",
  IceCream: "ice-cream",
  Cake: "cake",
  Gift: "gift",
  Heart: "heart",
  Star: "star",
  Music: "music",
  Movie: "movie",
  Book: "book",
  Books: "bookshelf",
  Briefcase: "briefcase",
  Tool: "tools",
  Tools: "tools",
  Hammer: "hammer",
  Wrench: "wrench",
  Settings: "cog",
  Phone: "phone",
  DeviceMobile: "cellphone",
  Wifi: "wifi",
  Cloud: "cloud",
  Sun: "white-balance-sunny",
  Moon: "moon-waning-crescent",
  Umbrella: "umbrella",
  Tree: "tree",
  Leaf: "leaf",
  Flower: "flower",
  Dog: "dog",
  Cat: "cat",
  Paw: "paw",
  Activity: "pulse",
  ActivityHeartbeat: "heart-pulse",
  FirstAidKit: "medical-bag",
  Pill: "pill",
  Stethoscope: "stethoscope",
  Vaccine: "needle",
  Run: "run",
  Walk: "walk",
  Bike: "bike",
  Swimming: "swim",
  Yoga: "meditation",
  Barbell: "dumbbell",
  Trophy: "trophy",
  Medal: "medal",
  School: "school",
  Certificate: "certificate",
  Palette: "palette",
  Brush: "brush",
  Camera: "camera",
  Photo: "image",
  Video: "video",
  Headphones: "headphones",
  Microphone: "microphone",
  Shirt: "tshirt-crew",
  Shoe: "shoe-formal",
  Watch: "watch",
  Diamond: "diamond",
  Crown: "crown",
  Rocket: "rocket",
  Bulb: "lightbulb",
  Bolt: "lightning-bolt",
  Flame: "fire",
  Droplet: "water",
  Snowflake: "snowflake",
  Beach: "beach",
  Mountain: "terrain",
  Compass: "compass",
  Map: "map",
  Globe: "earth",
  World: "earth",
  Flag: "flag",
  Clock: "clock",
  Calendar: "calendar",
  Alarm: "alarm",
  Bell: "bell",
  Mail: "email",
  Send: "send",
  Inbox: "inbox",
  Archive: "archive",
  Trash: "trash-can",
  Edit: "pencil",
  Copy: "content-copy",
  Link: "link",
  Bookmark: "bookmark",
  Tag: "tag",
  Filter: "filter",
  Search: "magnify",
  Zoom: "magnify",
  Eye: "eye",
  EyeOff: "eye-off",
  Lock: "lock",
  Key: "key",
  Shield: "shield",
  User: "account",
  Users: "account-group",
  UserPlus: "account-plus",
  ChartBar: "chart-bar",
  ChartLine: "chart-line",
  ChartPie: "chart-pie",
  Coin: "currency-usd",
  CurrencyDollar: "currency-usd",
  CurrencyEuro: "currency-eur",
  CurrencyPound: "currency-gbp",
  Receipt: "receipt",
  FileText: "file-document",
  Folder: "folder",
  Database: "database",
  Server: "server",
  Printer: "printer",
  Qrcode: "qrcode",
  Gamepad: "gamepad-variant",
  Puzzle: "puzzle",
  Dice: "dice-multiple",
  Ghost: "ghost",
  Robot: "robot",
  Alien: "alien",
  Skull: "skull",
  Baby: "baby-carriage",
  BabyCarriage: "baby-carriage",
  Bed: "bed",
  Bath: "bathtub",
  Toilet: "toilet",
  Lamp: "lamp",
  Couch: "sofa",
  Fridge: "fridge",
  Microwave: "microwave",
  Oven: "stove",
  Blender: "blender",
  Laundry: "washing-machine",
  Iron: "iron",
  Broom: "broom",
  Recycle: "recycle",
  Seedling: "sprout",
  Thermometer: "thermometer",
  Gas: "gas-station",
  GasStation: "gas-station",
  Parking: "parking",
  Road: "road",
  Ambulance: "ambulance",
  Helicopter: "helicopter",
  Anchor: "anchor",
  Fish: "fish",
  Turtle: "turtle",
  Bird: "bird",
  Butterfly: "butterfly",
  Spider: "spider",
  Bug: "bug",
  Virus: "virus",
  Dna: "dna",
  Atom: "atom",
  Magnet: "magnet",
  Telescope: "telescope",
  Microscope: "microscope",
  Flask: "flask",
  Beaker: "beaker",
  TestTube: "test-tube",
  Syringe: "needle",
  Bandage: "bandage",
  Wheelchair: "wheelchair",
  Bone: "bone",
  Brain: "brain",
  Lungs: "lungs",
  Glasses: "glasses",
  Sunglasses: "sunglasses",
  Tie: "tie",
  Ring: "ring",
  Scissors: "content-cut",
  Needle: "needle",
  Ruler: "ruler",
  Pen: "pen",
  Pencil: "pencil",
  Marker: "marker",
  Eraser: "eraser",
  Paperclip: "paperclip",
  Pin: "pin",
  Note: "note",
  Notebook: "notebook",
  Newspaper: "newspaper",
  Letter: "email",
  Envelope: "email",
  Package: "package",
  Box: "package-variant",
  // Default/fallback icons
  QuestionMark: "help-circle",
  Help: "help-circle",
  SeparatorHorizontal: "arrow-split-horizontal"
}

interface CategoryIndicatorProps {
  className?: string
  iconSize?: number
  color?: string
  icon?: string
  includeInReports?: boolean
  isSplit?: boolean
  isIncome?: boolean
}

export function CategoryIndicator({
  className,
  iconSize = 16,
  color,
  icon,
  includeInReports = true,
  isSplit = false,
  isIncome = false
}: CategoryIndicatorProps) {
  const getBackgroundColor = () => {
    if (!includeInReports || isSplit) return "bg-gray-200"
    if (isIncome) return "bg-gray-200"
    if (!color) return "bg-gray-200"
    return CATEGORY_BACKGROUND_COLORS[color as CategoryColor] || "bg-gray-200"
  }

  const getIconColor = () => {
    if (!includeInReports) return "#d1d5db" // gray-300
    if (isSplit) return "#d1d5db" // gray-300
    if (isIncome) return "#22c55e" // green-500
    if (!color) return "#ef4444" // red-500
    return "#ffffff" // white
  }

  const getIconName = (): IconName => {
    if (isIncome) return "currency-gbp"
    if (isSplit) return "arrow-split-horizontal"
    if (!includeInReports) return "eye-off"
    if (!icon) return "help-circle"
    return iconMap[icon] || "help-circle"
  }

  return (
    <View
      className={cn("items-center justify-center rounded-full", getBackgroundColor(), className)}
    >
      <MaterialCommunityIcons name={getIconName()} size={iconSize} color={getIconColor()} />
    </View>
  )
}
