var appConfig = {
	"installation": "TestFire"
	"version":"1.0.0"
	"parts": {
		supplies: {
			"example_supply_name": ["manifold_line_1", "manifold_line_2"]
			"why": ["W1", "W2", "W3", "H4", "H5", "Y6", "Y7"],
			"left_eye": [],
			"right_eye": [],
			"master":["why", "left_eye", "right_eye"]
		}
		effects: {
			"example_effect_name":["supply_solenoid_1", "supply_solenoid_2" ]	
			"fx1":["why"],
			"fx2":["why", "right_eye"],
			"fx3":["left_eye"],
			"fx4":["W1"],
			"W":["W1", "W2", "W3"],
			"H":["H4", "H5"],
			"Y":["Y6", "Y7"]	
		}
		igniters: {
			"example_igniter": ["fx1","fx2","fx3"],
			"W1":["W"],
			"W2":["W"],
			"W3":["W"],
			"H":["H"], 
			"Y":["Y"]	
		}
		
	}
};
