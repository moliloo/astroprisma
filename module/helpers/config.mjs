export const astroprisma = {}

astroprisma.ascii = `     
     _    ____ _____ ____   ___  ____  ____  ___ ____  __  __    _______    
    / \\  / ___|_   _|  _ \\ / _ \\|  _ \\|  _ \\|_ _/ ___||  \\/  |  / \\ \\ \\ \\   
   / _ \\ \\___ \\ | | | |_) | | | | |_) | |_) || |\\___ \\| |\\/| | / _ \\ \\ \\ \\  
  / ___ \\ ___) || | |  _ <| |_| |  __/|  _ < | | ___) | |  | |/ ___ \\ \\ \\ \\ 
 /_/   \\_\\____/ |_| |_| \\_\\\\___/|_|   |_| \\_\\___|____/|_|  |_/_/   \\_\\_\\_\\_\\
					
`

astroprisma.statusBonus = {
	vig: 'ASTRO.stat.vig',
	gra: 'ASTRO.stat.gra',
	min: 'ASTRO.stat.min',
	tec: 'ASTRO.stat.tec'
}

astroprisma.weaponType = {
	ranged: 'ASTRO.weapon.type.ranged',
	melee: 'ASTRO.weapon.type.melee'
}

astroprisma.hackType = {
	ranged: 'ASTRO.hack.type.normal',
	melee: 'ASTRO.hack.type.master'
}

astroprisma.statusEffects = [
	{
		id: 'overheat',
		name: 'ASTRO.statusEffects.overheat',
		img: 'icons/svg/fire.svg'
	},
	{
		id: 'shock',
		name: 'ASTRO.statusEffects.shock',
		img: 'icons/svg/lightning.svg'
	},
	{
		id: 'stun',
		name: 'ASTRO.statusEffects.stun',
		img: 'icons/svg/daze.svg'
	},
	{
		id: 'silence',
		name: 'ASTRO.statusEffects.silence',
		img: 'icons/svg/silenced.svg'
	},
	{
		id: 'breach',
		name: 'ASTRO.statusEffects.breach',
		img: 'icons/svg/hazard.svg'
	},
	{
		id: 'immunity',
		name: 'ASTRO.statusEffects.immunity',
		img: 'icons/svg/aura.svg'
	}
]
