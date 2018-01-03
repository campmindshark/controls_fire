var appConfig = {
	"installation": "TestFire"
	"version":"1.0.0"
	"parts": {
		supplies: {
			"Example Supply Name": ["Manifold 1", "Manifold2"]
			"why": ["W1", "W2", "W3", "H4", "H5", "Y6", "Y7"],
			"left eye": [],
			"right eye": [],
			"master":["why", "left eye", "right eye"]
		}
		effects: {
			"Example Effect Name":["Supply Solenoid 1", "Supply Solenoid 2" ]	
			"fx1":["why"],
			"fx2":["why", "right eye"],
			"fx3":["left eye"],
			"fx4":["W1"],
			"W":["W1", "W2", "W3"],
			"H":["H4", "H5"],
			"Y":["Y6", "Y7"]	
		}
		igniters: {
			"Example Igniter": ["Effect 1","Effect 2","Effect 3"],
			"W1":["W"],
			"W2":["W"],
			"W3":["W"],
			"H":["H"], 
			"Y":["Y"]	
		}
		
	}
};
