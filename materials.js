const materials = [
    // Gathering Items
    {
        name: 'Scrap Metal',
        type: 'Material',
        icon: 'icons/iron_ore.png',
        slot: 'material',
        stackable: true,
        isDisassembleable: false,
    },
    {
        name: 'Titanium',
        type: 'Material',
        icon: 'icons/titanium.png',
        slot: 'Material',
        stackable: true,
        isDisassembleable: false,
    },

    // Crafting items
    {
        name: 'Minor Electronic Circuit',
        type: 'material',
        icon: 'icons/minor_electronic_circuit.png',
        slot: 'Material',
        stackable: true,
        isDisassembleable: false,
        disassembleResults: [],
    },

    {
        name: 'Unstable Photon',
        type: 'material',
        icon: 'icons/unstable_photon.png',
        slot: 'Material',
        stackable: true,
        isDisassembleable: false,
        disassembleResults: [],
    },

    {
        name: "Synthetic Poison Gland",
        type: 'material',
        icon: 'icons/synthetic_poison_gland.png',
        slot: 'Material',
        stackable: true,
        isDisassembleable: false,
        disassembleResults: [],
    },

    {
        name: 'Crystalized Light',
        type: 'material',
        icon: 'icons/crystalized_light.png',
        slot: 'Material',
        stackable: true,
        isDisassembleable: false,
        disassembleResults: [],
    },

    {
        name: 'Partical Fuser',
        type: 'material',
        icon: 'icons/partical_fuser.png',
        slot: 'Material',
        stackable: true,
        isDisassembleable: false,
        disassembleResults: [],
        description: 'Crafting Material for advanced technology.'
    },
    {
        name: 'Titanium Thorn',
        type: 'material',
        icon: 'icons/titanium_thorn.png',
        slot: 'Material',
        stackable: true,
        isDisassembleable: false,
        disassembleResults: [],
    },
    {
        name: 'Metal Scorpion Fang',
        type: 'material',
        icon: 'icons/metal_scorpion_fang.png',
        slot: 'Material',
        stackable: true,
        isDisassembleable: false,
        disassembleResults: [],
    },

    {
        name: 'Flame Shell',
        type: 'material',
        icon: 'icons/flame_shell.png',
        slot: 'Material',
        stackable: true,
        isDisassembleable: false,
        disassembleResults: [],
    },

    {
        name: 'Pyro Core',
        type: 'material',
        icon: 'icons/pyro_core.png',
        slot: 'Material',
        stackable: true,
        isDisassembleable: false,
        disassembleResults: [],
    },

    // Common Items (Tier 1)
    {
        name: "Wire Bundle",
        type: "Material",
        icon: "icons/wire_bundle.png",
        description: "A bundle of assorted wires salvaged from robotic enemies.",
        quantity: 1,
        sellValue: 3,
        isDisassembleable: false
    },
    {
        name: "Spider Leg Segment",
        type: "Material",
        icon: "icons/spider_leg.png",
        description: "A segment from a robotic spider's leg. Could be useful for crafting.",
        quantity: 1,
        sellValue: 4,
        isDisassembleable: false
    },
    {
        name: "Optic Sensor",
        type: "Material",
        icon: "icons/optic_sensor.png",
        description: "A basic optical sensor from a robot. Still functional.",
        quantity: 1,
        sellValue: 6,
        isDisassembleable: false
    },
    {
        name: "Metal Fasteners",
        type: "Material",
        icon: "icons/fasteners.png",
        description: "Assorted screws, bolts, and fasteners. Common but necessary.",
        quantity: 1,
        sellValue: 2,
        isDisassembleable: false
    },
    {
        name: "Basic Servo",
        type: "Material",
        icon: "icons/basic_servo.png",
        description: "A simple servo motor used in basic robotics.",
        quantity: 1,
        sellValue: 8,
        isDisassembleable: false
    },
    
    // Uncommon Items (Tier 2)
    {
        name: "Small Power Cell",
        type: "Material",
        icon: "icons/power_cell.png",
        description: "A compact power cell that still holds a charge.",
        quantity: 1,
        sellValue: 12,
        isDisassembleable: false
    },
    {
        name: "Copper Coil",
        type: "Material",
        icon: "icons/copper_coil.png",
        description: "A coil of copper wire used in electromagnetic components.",
        quantity: 1,
        sellValue: 10,
        isDisassembleable: false
    },
    {
        name: "Memory Chip",
        type: "Material",
        icon: "icons/memory_chip.png",
        description: "A small memory chip salvaged from a robot.",
        quantity: 1,
        sellValue: 15,
        isDisassembleable: false
    },
    {
        name: "Stabilizer",
        type: "Material",
        icon: "icons/stabilizer.png",
        description: "A component used to stabilize robotic movements.",
        quantity: 1,
        sellValue: 14,
        isDisassembleable: false
    },
    {
        name: "Basic Sensor Array",
        type: "Material",
        icon: "icons/sensor_array.png",
        description: "A collection of basic sensors that can detect various inputs.",
        quantity: 1,
        sellValue: 18,
        isDisassembleable: false
    },
    
    // Rare Items (Tier 3)
    {
        name: "Advanced Servo",
        type: "Material",
        icon: "icons/advanced_servo.png",
        description: "A high-quality servo motor with precision movement capabilities.",
        quantity: 1,
        sellValue: 35,
        isDisassembleable: false
    },
    {
        name: "Targeting Module",
        type: "Material",
        icon: "icons/targeting_module.png",
        description: "A sophisticated aiming system from a combat robot.",
        quantity: 1,
        sellValue: 40,
        isDisassembleable: false
    },
    {
        name: "Power Converter",
        type: "Material",
        icon: "icons/power_converter.png",
        description: "Efficiently converts energy between different forms.",
        quantity: 1,
        sellValue: 38,
        isDisassembleable: false
    },
    {
        name: "Titanium Plating",
        type: "Material",
        icon: "icons/titanium_plating.png",
        description: "Durable titanium armor segment from a reinforced robot.",
        quantity: 1,
        sellValue: 42,
        isDisassembleable: false
    },
    {
        name: "Neural Processor",
        type: "Material",
        icon: "icons/neural_processor.png",
        description: "A specialized processor that mimics neural connections.",
        quantity: 1,
        sellValue: 45,
        isDisassembleable: false
    },
    
    // Very Rare Items (Tier 4)
    {
        name: "Quantum Capacitor",
        type: "Material",
        icon: "icons/quantum_capacitor.png",
        description: "Advanced energy storage device using quantum principles.",
        quantity: 1,
        sellValue: 80,
        isDisassembleable: false
    },
    {
        name: "High-Density Power Cell",
        type: "Material",
        icon: "icons/hd_power_cell.png",
        description: "Stores an incredible amount of energy in a compact form.",
        quantity: 1,
        sellValue: 75,
        isDisassembleable: false
    },
    {
        name: "Neural Network Module",
        type: "Material",
        icon: "icons/neural_network.png",
        description: "A complex module capable of machine learning operations.",
        quantity: 1,
        sellValue: 85,
        isDisassembleable: false
    },
    
    // Epic Items (Tier 5)
    {
        name: "Phase Converter",
        type: "Material",
        icon: "icons/phase_converter.png",
        description: "Experimental technology that can manipulate the phase of matter.",
        quantity: 1,
        sellValue: 150,
        isDisassembleable: false
    },
    {
        name: "AI Core Fragment",
        type: "Material",
        icon: "icons/ai_core.png",
        description: "A fragment of an advanced AI core. Extremely valuable for research.",
        quantity: 1,
        sellValue: 180,
        isDisassembleable: false
    },
    {
        name: "Synthetic Biofluid",
        type: "Material",
        icon: "icons/biofluid.png",
        description: "A mysterious fluid that bridges the gap between organic and synthetic.",
        quantity: 1,
        sellValue: 160,
        isDisassembleable: false
    },
    
    // Legendary Items (Tier 6)
    {
        name: "Quantum Core",
        type: "Material",
        icon: "icons/quantum_core.png",
        description: "A complete quantum computing core. Extraordinarily rare and valuable.",
        quantity: 1,
        sellValue: 350,
        isDisassembleable: false
    },
    {
        name: "Temporal Stabilizer",
        type: "Material",
        icon: "icons/temporal_stabilizer.png",
        description: "Rumored to have effects on the flow of time itself.",
        quantity: 1,
        sellValue: 400,
        isDisassembleable: false
    },
    {
        name: "Nanite Cluster",
        type: "Material",
        icon: "icons/nanite_cluster.png",
        description: "A swarm of microscopic robots that can reshape material at the atomic level.",
        quantity: 1,
        sellValue: 380,
        isDisassembleable: false
    }
];

// Export the materials array
window.materials = materials; 